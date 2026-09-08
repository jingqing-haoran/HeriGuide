# HeriGuide 文脉向导

> **Discover China's Stories — 把红色文化讲给世界，让故事被真正读懂。**

HeriGuide 是面向来华外国游客的**公益 H5 智慧导览平台**，以多模态语言技术赋能红色景区国际化服务。项目团队于 2026 年 4–8 月对武汉 10 处红色场馆完成实地调研，并以"游览 — 理解 — 共鸣 — 分享"为闭环设计产品。

- 📱 **移动端 H5**（`mobile.html`）：主战场，扫码即用、单手操作、五 Tab 底部导航；
- 🖥️ **PC 官网**（`index.html`）：以"红色文化国际传播"为叙事主线。

## 在线演示

- 🖥️ **PC 官网**：<https://jingqing-haoran.github.io/HeriGuide/>
- 📱 **移动端 H5**：<https://jingqing-haoran.github.io/HeriGuide/mobile.html>

打开 GitHub 仓库即可通过上方链接直接体验完整前端 Demo，无需本地安装。

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



## 技术栈

```text
前端：React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Lucide Icons
后端：Python · FastAPI · SQLAlchemy 2 · Pydantic v2（默认 SQLite，可切 MySQL）
```

完整后端接口文档与数据模型见 [backend/README.md](./backend/README.md)。

代码结构：

```text
src/
├── shared/          # 类型、i18n、地点 / 社区 / 徽章数据、路由与滚动 hooks
├── mobile/          # 移动端 App Shell、页面与组件
├── desktop/         # PC 官网导航与章节式页面
└── styles/          # 设计令牌 + shared / mobile / desktop CSS

backend/
├── app/             # FastAPI 应用：配置、模型、Schema、种子数据与 API 路由
├── tests/           # 接口测试
└── requirements.txt
```

前端数据层使用类型化本地数据 + Mock Service，因此在线 Demo 可脱离后端运行；仓库内已配套完整的 FastAPI 后端，联调时把前端请求指向 `http://127.0.0.1:8000/api` 即可无缝替换。地图与翻译 API 一律通过环境变量注入，不写死密钥。

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

启动后端 API（默认 SQLite，自动建表并写入演示数据）：

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

接口调试：<http://127.0.0.1:8000/docs>

## 真实图片版权与数据边界

本仓库当前为 **Demo**：


- 讲解文案、译文、地图点位与社区内容为团队整理的演示材料，均需在正式上线前由场馆与专业审核确认；
- 红色史实与术语多语种翻译坚持人工精校 + 教师审核，防止文化误译。

## 公益说明

HeriGuide 是非盈利公益文化服务项目，内容免费开放。社区志愿者的高质量答疑可对接学校志愿服务时长认定，虚拟荣誉徽章仅为数字形态，不涉及任何实物奖励。

---

**华中师范大学多学科团队 · 外国语 × 物理 × 城环 × 文学**
