# MQTT Toast

![GitHub Actions](https://github.com/your-username/mqtt_toast/workflows/Build%20and%20Release/badge.svg)

MQTT Toast 是一个基于 Tauri 框架的桌面 GUI 应用，用于实现 MQTT 消息订阅并触发系统通知。该应用支持 TLS 安全连接，允许用户上传 CA 证书以建立安全的 MQTT 连接。

## 功能特点

- 配置 MQTT Broker 地址、端口、认证信息（用户名/密码）
- 支持上传 CA 证书以建立 TLS 加密连接
- 订阅指定 Topic 并监听消息
- 接收到消息后通过 Tauri 触发前端系统通知（Toast）
- 系统托盘图标支持，最小化到系统托盘
- 开机自启功能
- 跨平台支持（Windows、macOS、Linux）

## 技术栈

### 前端
- HTML/CSS/Vanilla JS
- [Tauri API](https://tauri.app/) v2
- [@tauri-apps/plugin-notification](https://v2.tauri.app/plugin/notification/) 用于系统通知
- [@tauri-apps/plugin-autostart](https://v2.tauri.app/plugin/autostart/) 用于开机自启

### 后端
- [Rust](https://www.rust-lang.org/) 
- [Tauri](https://tauri.app/) v2 框架
- [rumqttc](https://crates.io/crates/rumqttc) MQTT 客户端
- [tokio](https://tokio.rs/) 异步运行时
- [winrt-notification](https://crates.io/crates/winrt-notification) Windows 原生通知（仅 Windows 平台）

### 构建工具
- [Vite](https://vitejs.dev/) 前端构建工具
- [Cargo](https://doc.rust-lang.org/cargo/) Rust 包管理器和构建工具
- [pnpm](https://pnpm.io/) Node.js 包管理器

## 开发环境搭建

### 系统要求

- Node.js >= 18
- Rust 工具链
- pnpm 包管理器
- 系统特定依赖（Tauri 前置条件）

### 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd mqtt_toast

# 安装前端依赖
pnpm install
```

注意：在 Windows 上，您可能需要安装 WebView2 Runtime 和 Visual Studio Build Tools。

## 运行和构建

### 开发模式

```bash
# 运行开发服务器
pnpm tauri:dev
```

### 生产构建

```bash
# 构建生产版本
pnpm tauri:build
```

构建产物将包含适用于 Windows、macOS 和 Linux 的安装包。

## 自动构建

该项目使用 GitHub Actions 进行自动构建。每次推送到 `main` 分支或创建新标签时，都会触发构建流程。

构建产物包括：
- Windows (.msi)
- macOS (.app)
- Linux (.deb)

## 使用说明

1. 启动应用后，在配置界面输入 MQTT Broker 的地址、端口和认证信息
2. 如需要 TLS 连接，上传您的 CA 证书文件
3. 输入要订阅的 Topic
4. 点击"连接"按钮建立 MQTT 连接
5. 应用将在后台监听消息并在收到消息时显示系统通知

## 许可证

[添加您的许可证信息]