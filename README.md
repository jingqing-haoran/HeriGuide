# HeriGuide 文脉向导

> **Discover China's Stories — 把红色文化讲给世界，让故事被真正读懂。**

HeriGuide 是面向来华外国游客的**公益 H5 智慧导览平台**，以多模态语言技术赋能红色景区国际化服务。项目团队于 2026 年 4–8 月对武汉 10 处红色场馆完成实地调研，并以"游览 — 理解 — 共鸣 — 分享"为闭环设计产品。本仓库是参赛 Demo 阶段的**双端前端实现**：

- 📱 **移动端 H5**（`mobile.html`）：主战场，扫码即用、单手操作、五 Tab 底部导航；
- 🖥️ **PC 官网**（`index.html`）：路演展示与公开介绍，以"红色文化国际传播"为叙事主线。

## 为什么做 HeriGuide

外国游客走进红色场馆，往往"看得见文物，却读不懂故事"：

- 多语种导游稀缺，小语种服务几乎空白；
- 展牌与讲解多为中英直译，缺少历史文化语境；
- 馆内路线、展厅与服务设施缺少可视化指引；
- 游客缺少分享、提问与跨文化交流的渠道。

HeriGuide 不是把"红色文化"做成单向宣讲，而是让每一位游客以自己的语言完成一次完整的文化旅程，并把所见所感带回自己的世界。

## 页面与功能

| 端 | 页面 | 关键能力 |
| --- | --- | --- |
| H5 | Home | 大图 Hero、附近文脉、核心功能、重点场馆、How It Works |
| H5 | Explore | 多语言搜索筛选、分类列表、加载 / 空状态 |
| H5 | Map | 馆内 / 街区地图 Demo、Marker 选择、Bottom Sheet、路线预览 |
| H5 | Community | Discover / Questions / Stories、点赞评论、发布与志愿者答疑 |
| H5 | Profile | My Journey、荣誉徽章体系、志愿与隐私入口 |
| H5 | Place Detail | 快速信息、Explore Tabs、四语讲解、室内点位、Cultural Note |
| H5 | Translation | 中英法西方向切换、术语带注释翻译、拍照 / 语音占位、一键求助 |
| PC | Landing | 叙事式首页：使命、场馆、功能、文化转译、社区、荣誉 |

## 视觉方向

**Museum × Travel × Culture × Technology**

参考 Apple / Airbnb / Google Maps / National Geographic 的产品气质，但不复制任何一家：

- Warm White / Off White / Charcoal 基底，朱砂红仅作 CTA、Active、Marker 与徽章；
- 博物馆式衬线标题 + 现代无衬线 UI，字体本地打包，离线可用；
- 克制动效：Fade Up、Card Hover Lift、Button Scale、Bottom Sheet Spring、Marker Pulse；
- 移动端重要按钮均放在拇指可达区，禁止横向溢出；
- 所有页面覆盖 Loading / Empty / Error / Success 状态与无障碍基础。

设计系统详见 [DESIGN.md](./DESIGN.md)，产品事实记录见 [PRODUCT.md](./PRODUCT.md)。

## 技术栈

```text
React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Lucide Icons
```

代码结构：

```text
src/
├── shared/          # 类型、i18n、地点 / 社区 / 徽章数据、路由与滚动 hooks
├── mobile/          # 移动端 App Shell、页面与组件
├── desktop/         # PC 官网导航与章节式页面
└── styles/          # 设计令牌 + shared / mobile / desktop CSS
```

数据层使用**类型化本地数据 + Mock Service**，保留未来无缝替换 FastAPI / MySQL 后端的接口结构；地图与翻译 API 一律通过环境变量注入，不写死密钥。

## 本地运行

需要 Node.js 与 pnpm：

```bash
pnpm install
pnpm dev
```

开发地址：

- PC：<http://localhost:5173/>
- 移动端 H5：<http://localhost:5173/mobile.html>

生产构建与预览：

```bash
pnpm build
pnpm preview
```

## 真实图片版权与数据边界

本仓库当前为 **Demo**：

- 场馆照片来自 Wikimedia Commons，作者与授权详见 [PHOTO_CREDITS.md](./public/images/places/PHOTO_CREDITS.md)；
- 讲解文案、译文、地图点位与社区内容为团队整理的演示材料，均需在正式上线前由场馆与专业审核确认；
- 红色史实与术语多语种翻译坚持人工精校 + 教师审核，防止文化误译。

## 公益说明

HeriGuide 是非盈利公益文化服务项目，内容免费开放。社区志愿者的高质量答疑可对接学校志愿服务时长认定，虚拟荣誉徽章仅为数字形态，不涉及任何实物奖励。

---

**华中师范大学多学科团队 · 外国语 × 物理 × 城环 × 文学**
