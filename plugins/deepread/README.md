# DeepRead 深读

DeepRead 是一个面向 ZTools 的本地小说阅读插件，使用官方 Vue + TypeScript + Vite 模板结构开发。

## 功能

- 本地 `.txt` / `.md` 小说导入，支持 ZTools 文件匹配指令直接导入
- 书架、阅读进度保存、分页阅读、目录解析、全文搜索跳转
- 字号、行距、底栏尺寸、透明度、主题、自动翻页设置
- 低调外观、快速隐藏、鼠标移出隐藏、滚轮/键盘翻页
- ZTools 指令支持：打开、导入、上一页、下一页、隐藏/显示、关闭、自动翻页、低调模式

## 开发

```bash
npm install
npm run dev
```

浏览器开发入口是 `http://localhost:5173`。如果要把 ZTools 也接到 Vite 开发服务，可以临时在 `public/plugin.json` 加上 `development.main` 指向这个地址；正式安装时不需要这个字段。

## 构建

```bash
npm run build
```

构建产物在 `dist/` 中，`public/plugin.json`、`public/preload/services.js` 和 `public/logo.png` 会被 Vite 复制到产物目录。

## 本地安装

先执行 `npm run build`，然后在 ZTools 中安装以下任一目录：

- 推荐：`dist/`
- 也可以：项目根目录，本仓库根目录的 `plugin.json` 会指向 `dist/index.html`

不要直接安装 `public/` 目录；那里只有待复制的静态资源，没有构建后的页面入口。
