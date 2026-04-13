# MCP 与 Skills 参考（IOCA React 组件库）

本仓库是一个 React 组件库 + 文档站点：

- 组件统一出口在 [index.ts](file:///d:/codes/ioca-react/packages/index.ts)
- 文档页面在 [docs](file:///d:/codes/ioca-react/docs/) 下，按 `docs/pages/<name>/index.tsx` 组织

## MCP（Model Context Protocol）在本项目中的用法

MCP 是一套“让 Agent 调用外部能力”的协议。对本项目来说，MCP 的价值主要在两类场景：

- 在浏览器里验证组件行为（交互、样式、响应式、回归截图等）
- 将高频工程动作封装成可复用工具（例如：同步导出列表与文档目录、批量生成页面骨架）

### 1) 适合用 MCP 做什么

- 文档站回归：打开本地预览站点，跳转到 `/docs/<component>`，执行点击/输入/滚动等操作，观察 UI 变化
- 视觉检查：对比布局、对齐、间距、颜色、暗色主题、不同屏幕宽度下表现
- 稳定性检查：重复打开弹窗、下拉、抽屉等组件，确认不会出现遮罩层残留、滚动穿透、焦点丢失等问题

### 2) 本仓库的“页面入口”与“路由规则”

- 文档站入口是 [index.html](file:///d:/codes/ioca-react/index.html) 中加载的 [main.tsx](file:///d:/codes/ioca-react/docs/main.tsx)
- 文档页面路由由 `docs/router/routes.tsx` 通过 `import.meta.glob("@d/pages/*/index.tsx")` 自动注册
  - 规则：存在 `docs/pages/<name>/index.tsx` 就会生成 `/docs/<name>` 页面
  - 这意味着：新增组件文档页面通常只需要新增对应目录与 `index.tsx`（不一定需要手写路由表）

### 3) 推荐的 MCP 验证清单（面向组件库）

- 交互：hover/active/focus、键盘可达性（Tab/Enter/Escape）、禁用态
- 布局：容器宽度变化、长文本/极端内容、滚动容器与定位（如 Affix/Popup/Dropdown）
- 可访问性：可见焦点、语义与 aria（至少在文档站层面不出现明显可用性问题）
- 主题：如果组件支持主题切换，检查亮/暗模式与主题色

## Skills（技能）在本项目中的参考用法

Skills 可以理解为“可安装的工作流/专家指南”，用来在写组件、写文档、做 UI 审核时更稳定。

### 1) 推荐优先使用的技能（已内置可用）

- React / Next.js 性能最佳实践：适合在做组件实现、避免不必要 re-render、拆分 bundle 前做自检
- Web UI 设计与可访问性检查：适合在完善文档站页面、Demo 布局、交互细节时做审阅

### 2) 建议为本仓库自建一个技能（可选）

当你发现以下动作重复出现时，适合做成“项目专用技能”：

- 新增组件时：同步更新导出列表 + 生成文档页面目录 + 生成属性表骨架
- 组件命名约定：`packages/components/<name>/...` 与 `docs/pages/<name>/...` 的一致性校验
- 文档路由与菜单：根据 `docs/pages` 自动推断可用页面，提示缺失项或重复项

一个“IOCA 专用技能”的职责可以是：

- 读取 [index.ts](file:///d:/codes/ioca-react/packages/index.ts) 的导出列表，得到组件名集合
- 扫描 `docs/pages/*/index.tsx`，得到已存在文档集合
- 输出差异报告：哪些组件缺少文档、哪些文档页面没有对应组件导出
-（可选）提供一键生成缺失文档骨架的动作

### 3) 新增组件时的工作流建议（配合技能/自动化）

- 生成组件骨架：仓库已提供 `pnpm make <ComponentName>`（见 [templates/index.js](file:///d:/codes/ioca-react/templates/index.js)）
- 导出组件：在 [index.ts](file:///d:/codes/ioca-react/packages/index.ts) 统一导出
- 新增文档页：新增 `docs/pages/<name>/index.tsx`（以及需要的话 `prop.tsx`）
- 验证：启动文档站并打开 `/docs/<name>`，完成最小交互回归

## 可选：为仓库实现自定义 MCP Server 的方向（仅建议）

如果希望把“同步/生成/校验”做到可调用工具，可以实现一个 Node MCP Server，并提供类似能力：

- `list_exports`：解析 `packages/index.ts` 并返回导出列表
- `list_doc_pages`：列出 `docs/pages/*/index.tsx`
- `diff_docs`：输出缺失/多余的页面
- `scaffold_doc_page`：创建 `docs/pages/<name>/index.tsx` 与 `prop.tsx` 骨架

这样 Agent 在做“新增组件/补齐文档/批量修复”时会更稳定，不依赖临时脚本。
