
# V 站主题定制

这是一套可工程化分发的 V2EX 自定义主题：支持明暗模式、变量化主色、可在线预览与一键复制。

在线使用：https://rockfang.github.io/v2ex-skin-demo/

## 你可以做什么
- **预设主题**：内置 6 套主题色系（Denim, Pine, Amber, Rust, Slate, Seafoam）
- **网站演示**：`/docs` 提供一个静态预览器：切换预设、模拟暗色、微调 H/S/L 并一键复制 CSS
- **覆盖说明**：见下方“覆盖范围”章节（页面、组件、选择器清单

## 快速使用
1. 打开[在线预览](https://rockfang.github.io/v2ex-skin-demo/) 或本地启动 `docs/index.html`。
2. 在面板中选择预设主题，或拖动 Hue / Sat / Light，并按需切换 Dark 模式确认夜间效果。
3. 点击左侧 “复制完整 CSS” 按钮，将生成的完整样式放入剪贴板。
4. 前往 V2EX → 设置 → 自定义 CSS 粘贴覆盖现有内容。
> 可以整份复制 `themes/*.min.css`（<5K）。

## 目录
```
serene-glass-product/
├─ themes/                      # 发行的主题文件（<5K，直接粘贴或 @import）
│  ├─ serene-glass.denim.min.css
│  ├─ serene-glass.pine.min.css
│  ├─ serene-glass.amber.min.css
│  ├─ serene-glass.rust.min.css
│  ├─ serene-glass.slate.min.css
│  └─ serene-glass.seafoam.min.css
├─ themes/snippets/             # 一行覆盖（仅设置主色 HSL）
│  ├─ denim.override.snippet.css
│  ├─ pine.override.snippet.css
│  ├─ amber.override.snippet.css
│  ├─ rust.override.snippet.css
│  ├─ slate.override.snippet.css
│  └─ seafoam.override.snippet.css
├─ docs/
│  ├─ index.html                # 预览器入口（也可以部署到 GitHub Pages）
│  ├─ app-base.css              # 预览器使用的基线主题（Denim）
│  └─ app.js
└─ README.md
```

## 覆盖范围
| 区域/页面 | 选择器 | 覆盖 | 说明 |
| --- | --- | --- | --- |
| 顶栏 | `#Top` | ✅ | 玻璃模糊、明暗联动（`:has(#Wrapper.Night)`）、边线与阴影 |
| 页面容器 | `#Wrapper` | ✅ | 变量作用域、暗色模式入口 |
| 卡片/列表 | `.box`, `.cell` | ✅ | 背景、边框、圆角、hover 阴影 |
| 主题标题 | `.header h1` | ✅ | 字号、字重（无彩色竖条，保持克制） |
| 元信息 | `.fade`, `.gray`, `.small`, `.snow` | ✅ | 中性色文本 |
| 计数徽标 | `a.count_livid` | ✅ | 使用主色变量 |
| 右栏卡片 | `#Rightbar > .box > .cell` | ✅ | 背景与边线统一 |
| 按钮 | `.normal.button`, `.super.button`, `input/button.normal.button` | ✅ | 明暗基底、hover/active/focus |
| 开关 | `.onoffswitch label .frame:before/after` | ✅ | ON=主色，OFF=卡片色加深；明暗自适配 |
| 回复气泡 | `.reply_content` | ✅ | 统一风格，*无箭头*（不越界） |
| 正文 Markdown | `.topic_content.markdown_body` | ✅ | 标题、列表、引用、代码、表格、图片 |
| 分页 | `.page_current`, `.page_normal`, `.outdated` | ✅ | 主色与中性色 |
| 防溢出 | `img`, `table`, `pre code` | ✅ | `max-width:100%`, `overflow:auto`, 强制换行 |
| 全局 | `html, body` | ✅ | `overflow-x:hidden` 避免横向滚动 |

> 若 V2EX 更新 DOM，优先在此表补充/调整选择器；尽量通过变量覆盖减少硬编码。

## 许可
MIT
