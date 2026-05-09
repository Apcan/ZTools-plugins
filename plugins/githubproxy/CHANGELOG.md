# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1](https://github.com/ZToolsCenter/ZTools-plugins) - 2026-05-09
### Changed

- HTTP 重定向处理：GitHub 文件下载链接（如 Release 附件或 Raw 文件）通常会重定向到 objects.githubusercontent.com，现已支持自动跟随 301/302/307/308 重定向
- 深色主题下输入框、表格、卡片等组件样式适配
- 页面滚动问题修复
- 修改拼写错误

## [1.0.0](https://github.com/ZToolsCenter/ZTools-plugins) - 2026-05-09

### Added

- **GitHub Proxy 功能**
  - 支持代理服务器选择，自动保存上次选择
  - 支持 Git Clone / Wget / Curl / Direct Download 多种下载方式
  - 自动生成代理加速链接
  - 一键复制命令到剪贴板
- **设置页面**
  - 代理服务器列表管理（添加、编辑、删除）
  - 单服务器测速和批量测速功能
  - 一键清理失效代理服务器
  - 数据持久化存储
- **关于页面**
  - 项目介绍和功能说明
  - 技术栈展示
  - 相关链接
- **深色主题支持**
  - 自动检测 ztools 主题设置
  - 手动切换主题按钮
  - Element Plus 组件深色主题适配
- **插件入口参数**
  - `dowload`：直接下载指定 URL 文件
  - `copygitclone`：复制 Git Clone 命令



