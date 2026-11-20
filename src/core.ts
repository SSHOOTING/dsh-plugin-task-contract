/**
 * Pure, dependency-free core for dsh-plugin-task-contract (Task Contract Card).
 * Reads only metadata from session events; never prompts, tool bodies or file contents.
 */

const SECRET_RE = /((?:token|key|secret|password|authorization|bearer)[^\s:=]{0,24}[:=]\s*)[^\s&]+/gi
const QUERY_RE = /([?&](?:token|key|secret|password|auth)=)[^&#\s]+/gi
/** Strip credential-looking substrings before anything is printed. */
export function redact(value: unknown): string {
  const text = value instanceof Error ? value.stack || value.message : String(value)
  return text.replace(SECRET_RE, '$1[redacted]').replace(QUERY_RE, '$1[redacted]')
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function analyze(events: readonly unknown[]): any {
  const list = Array.isArray(events) ? events : []
  const texts: any[] = []
  for (const e of list) {
    if (!isRecord(e) || !isRecord(e.data)) continue
    const d = e.data
    const raw = typeof d.input === 'string' ? d.input
      : (isRecord(d.message) && typeof d.message.content === 'string') ? d.message.content
      : (typeof d.text === 'string' ? d.text : '')
    if (raw && e.type !== 'assistant/message') texts.push(raw)
  }
  const req = texts[0] || ''
  const goal = req.slice(0, 140)
  // Heuristic: extract crisp signals without calling any model.
  const wants = /\b(must|should|need|require|ensure|verify|test)\b/i.test(req)
  const hasBudget = /\b(budget|tokens?|cost|under|within)\b/i.test(req)
  const hasDeadline = /\b(today|tomorrow|deadline|by\s+\w+day|before)\b/i.test(req)
  const neg = /\b(not|avoid|don't|never|except|unless)\b/i.test(req)
  const lines = [
    { key: 'goal', label: 'Goal', value: goal || '(no user request observed yet)' },
    { key: 'nonGoals', label: 'Non-goals', value: neg ? 'explicit exclusions detected in request' : 'none stated — confirm before acting' },
    { key: 'acceptance', label: 'Acceptance', value: wants ? 'explicit must/verify language found' : 'no acceptance criteria — add at least one' },
    { key: 'budget', label: 'Budget', value: hasBudget ? 'budget language found' : 'unset — suggest a token/time cap' },
    { key: 'risk', label: 'Risks', value: hasDeadline ? 'time pressure detected' : 'no deadline stated' },
  ]
  const complete = [wants, hasBudget, neg].filter(Boolean).length
  return { sampledEvents: list.length, lines, completeness: Math.round((complete / 3) * 100) }
}

export function formatReport(a: any, opts: { json?: boolean } = {}): string {
  if (opts.json) return JSON.stringify(a, null, 2)
  const head = '[task-contract] ' + a.completeness + '% contract signals found in ' + a.sampledEvents + ' event(s)'
  return [head, ...a.lines.map(l => '  ' + l.label + ': ' + redact(l.value))].join('\n') +
    '\nEdit this contract in chat before the agent proceeds.'
}
