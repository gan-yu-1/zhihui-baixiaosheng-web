# 郑大百晓生 · Dify 校园助手前端

基于官方 `langgenius/webapp-conversation` Fork 定制，保留 Next.js 15、React 19 与原有 Dify 会话、流式问答、文件上传和反馈逻辑。

对外名称统一为“郑大百晓生”；内部 `localStorage` 键和 Git 仓库名保持原样，以免影响已有浏览器数据与仓库配置。

## 本地预览

```bash
npm install
npm run dev -- --port 7100
```

打开 `http://localhost:7100/`。未配置 API Key 时，项目默认进入明确标注的前端演示模式，不会请求 Dify，演示回复也不代表校园政策答复。

## 接入 Dify

复制 `.env.example` 为 `.env.local`，在 Dify 控制台创建 Web App API Key 后填写：

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_ID=你的应用ID
NEXT_PUBLIC_APP_KEY=你的APIKey
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1
```

`.env.local` 已被 Git 忽略，不要提交真实密钥。当前仍沿用上游的客户端 API Key 模式；公开部署前应评估密钥暴露风险，必要时改为服务端代理。

## 经典酒红问答与 Trianon 手账展示

右下角的小本子/酒杯按钮在两种展示之间切换，选择保存在当前浏览器的 `localStorage` 键 `zhihui-baixiaosheng.ui-theme.v1`（内部键名保持不变），刷新后仍会保留。

- **经典酒红问答**：完整的 Dify 使用端。应用参数、会话创建、流式回答、历史记录、反馈和定时任务都在这里工作，真实问答只发生在这里。
- **Trianon 手账展示**：仅用于界面与交互演示。使用同源 iframe 加载固定入口 `/trianon/index.html#empty`，不共享酒红端的 Header、Sidebar 或 Chat，不请求 Dify，也不包含真实校园政策数据。页面以 1440×900 桌面画布居中等比缩放，窄屏提供“在新标签打开手账展示”的链接；所有校园问答仅作示例，不构成正式政策答复。

手账分支在 Dify 故障提示与加载状态之前渲染。Dify 不可用时仍可通过右下角按钮查看纯展示页；从手账切回经典酒红只恢复原有界面，不会新建会话或清空已有历史。两套展示共用同一份会话状态，但只有酒红端发起真实请求。

Trianon 单文件与许可放在 `public/trianon/`。来源、commit、MIT 许可以及素材和字体许可位置见 `CREDITS.md`。请保留原作者署名、许可文本和 `for 妁妁 only` 签名。

## 定时任务原型

顶部“定时任务”支持新建、编辑、启停和删除，配置保存在当前浏览器的 `localStorage` 中，清除浏览器数据会丢失，且不会跨设备同步。

**当前不会自动执行或离线推送，也尚未创建 Dify 定时 Workflow。** 后续接入时实现 `app/components/schedule/types.ts` 中的 `ScheduleRepository`，替换 `ScheduleDialog.tsx` 的默认 `localScheduleRepository` 即可复用界面和表单模型。

## 主要模块

- `app/components/index.tsx`：酒红端 Dify 主会话逻辑、演示分支与 Trianon 展示分支
- `app/components/trianon-showcase.tsx`：Trianon 全屏 iframe、居中等比缩放与窄屏入口
- `app/components/theme/ThemeToggle.tsx`：右下角“Trianon 手账展示/经典酒红问答”切换按钮
- `app/components/theme/theme-context.tsx`：展示层主题状态与本地保存
- `app/components/header.tsx`：酒红端顶部栏、定时任务入口
- `app/components/welcome/campus-welcome.tsx`：酒红端校园助手欢迎页
- `app/components/demo/demo-service.ts`：明确隔离的本地演示数据
- `app/components/schedule/`：定时任务界面、类型和本地存储适配器
- `config/index.ts`：应用名称、中文语言与演示模式判断
- `public/trianon/`：Trianon 单文件、原作者许可和素材/字体许可

## 检查

```bash
npx tsc --noEmit
npm run lint
npm run build
```

原上游项目已归档为只读；本仓库保留其许可证与来源信息，后续校园前端修改在此 Fork 中继续。
