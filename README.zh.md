# dsh-plugin-task-contract

**把一句含糊的请求变成可编辑的 5 行契约：目标、非目标、验收条件、预算与风险——在 Agent 开始前给出。**

这是 14 个 DSH Agent 生命周期只读可观测插件之一（主题：**任务契约卡**）。它只读取会话事件的元数据——从不读取提示词、工具调用内容或文件内容——且不发起任何网络请求。

## 安装

```powershell
dsh plugin --profile web add dsh-plugin-task-contract
```

需要 Node `^22.19.0 || >=24` 与 DSH `>=0.2.0-rc.2 <0.3.0`。

## 30 秒演示

1. 正常使用 DSH 几轮。
2. 在任意会话输入 `/task-contract`。
3. 得到紧凑的只读报告；用 `/task-contract --json` 获取机器可读输出。

## 它读取什么

只读取会话事件元数据：事件类型、工具名、token 计数与路由名。任何疑似凭据的值在显示前都会被脱敏。不读取、存储或传输文件内容与提示词。

## 许可

MIT — SSHOOTING。
