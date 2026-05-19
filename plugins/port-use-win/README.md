# Windows 端口占用

> 在 ZTools 中查看 Windows 当前端口占用，并按进程名、PID、端口、地址等字段筛选，还支持直接结束进程。

## 功能说明

- 使用 PowerShell 读取 `netstat` 与进程列表，展示当前 TCP / UDP 端口占用。
- 页面内可按字段切换筛选维度，顶部搜索框只输入值即可。
- 主表展示进程名、监听地址、协议，展开行查看远程地址、状态、Host / Port 等详情。
- 每条记录支持直接结束对应进程。

## 使用方式

1. 在 ZTools 中运行插件 `Windows 端口占用`。
2. 顶部下拉框选择筛选字段，例如 `PID`、`端口`、`本地地址`。
3. 在 ZTools 搜索框输入筛选值，例如 `82`、`node`、`LISTENING`、`127.0.0.1`。
4. 需要查看更多信息时，展开表格行；需要结束进程时，点击操作列删除按钮。

## 开发

```bash
npm install
npm run dev
```

开发模式下，ZTools 会通过 `public/plugin.json` 中的 `development.main` 加载本地页面。

## 构建

```bash
npm run build
```

构建后会生成 `dist/`，用于本地验证或发布。

## 目录结构

```text
.
├── public/
│   ├── logo.png
│   ├── plugin.json
│   └── preload/
│       ├── package.json
│       └── services.js
├── src/
│   ├── App.vue
│   ├── env.d.ts
│   ├── main.css
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.js
```

## 兼容性

- 仅支持 Windows。
- preload 会优先尝试 `pwsh`，未安装 PowerShell Core 时兼容系统自带的 `powershell.exe`。

## 发布备注

- 发布前请确认 `public/plugin.json` 中的版本号、描述、作者信息已更新。
- 若是新版本发布，建议同步维护 `CHANGELOG.md`，避免发布时出现 placeholder。
