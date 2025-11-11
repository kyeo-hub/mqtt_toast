# MQTT Toast (Tauri) - demo

这是一个最小的 Tauri 演示工程，演示如何把 MQTT 订阅和系统通知整合到一个桌面 GUI 应用里。

主要特性：
- 前端：简洁的设置表单（Broker、Port、用户名/密码、Topic、上传 CA）
- 后端：Rust + rumqttc 建立 MQTT 连接，支持加载 CA/TLS
- 接收消息后通过 Tauri 事件通知前端并弹出系统通知

注意：此 demo 需要在本地安装 Tauri 开发依赖（Rust + Node + tauri prerequisites）。

快速开始（Windows）：

1. 安装工具链：
   - 安装 Node.js（推荐 18+）
   - 安装 Rust（https://rustup.rs/）并安装 MSVC toolchain（Visual Studio Build Tools）
   - 安装 Tauri CLI（可选）: `cargo install tauri-cli`

2. 在项目根目录运行（建议在 PowerShell）：

```powershell
cd /d D:\projects\mqtt_toast
npm install
# 然后启动 Tauri dev（需要 tauri 前置条件和 Rust）
npm run tauri:dev
```

3. 在 UI 中填写 Broker、Topic，上传 `ca.crt`（如果使用 TLS），然后点击 `Start Subscribe`。

如果你无法或不想在本地构建，我也可以改成一个只包含前端和说明的 ZIP，或把后端改为 Node.js 实现（用 mqtt.js 与 Node TLS），但那会牺牲直接使用系统 TLS/证书的能力。

---

我已在仓库中添加了 Tauri 骨架：
- `src-tauri/`：Rust 后端（包含 tauri manifest）
- `src/`：前端文件（index.html, main.js, style.css）
- `README_TAURI.md`：本文件

下一步：
- 我可以把 rust TLS 的细节做得更健壮（支持 client cert、更多重连策略、持久化设置、托盘图标与开机自启选项），也可以把前端改为 React/Vue。告诉我你优先需要哪些增强。
