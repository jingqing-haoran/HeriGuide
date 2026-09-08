# HeriGuide Backend API

FastAPI + SQLAlchemy 后端，为 HeriGuide 双端前端提供 REST API。当前版本包含完整数据模型、统一响应、Demo 种子数据与测试；默认使用 SQLite，一行环境变量即可切换到 MySQL。

## 快速开始

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

打开 <http://127.0.0.1:8000/docs> 可交互调试全部接口。

首次启动会自动创建表并写入 8 处武汉红色场馆、多语种内容、地图点位、讲解、社区与徽章 Demo 数据。

## 环境变量

复制 `.env.example` 为 `.env` 后按需修改。默认配置即可运行：

```text
HERIGUIDE_DATABASE_URL=sqlite:///./heriguide.db
```

切换到 MySQL：

```text
HERIGUIDE_DATABASE_URL=mysql+pymysql://heriguide:password@127.0.0.1:3306/heriguide?charset=utf8mb4
```

## API 一览

| Method | Path | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 健康检查 |
| GET | `/api/places` | 场馆列表（locale / category / region / language / search / 分页） |
| GET | `/api/places/{id或slug}` | 场馆详情与多语种内容 |
| GET | `/api/places/{id}/guides` | 讲解与视频指南（audio / video / story） |
| GET | `/api/places/{id}/map` | 馆内点位地图 |
| POST | `/api/translation` | 翻译，返回术语注释 |
| GET / POST | `/api/community/posts` | 社区信息流 / 发布 |
| GET / POST | `/api/community/posts/{id}/comments` | 评论 |
| POST | `/api/community/posts/{id}/like` | 点赞 / 取消点赞 |
| GET / POST | `/api/users` | 用户查询 / 创建 |
| GET | `/api/users/{id}/journey` | 我的旅程与徽章 |
| POST | `/api/users/{id}/badges/{badge_id}/earn` | 获得徽章 |
| GET | `/api/badges` | 徽章目录 |
| POST | `/api/feedback` | 提交反馈 |

所有成功响应统一为：

```json
{ "code": 200, "message": "success", "data": {} }
```

错误响应同样携带 `code` 与 `message`。

## 数据库表

`users` · `places` · `place_translations` · `guides` · `map_points` · `community_posts` · `comments` · `likes` · `badges` · `user_badges` · `feedback`

## 测试

```bash
cd backend
pytest -q
```

## 设计说明

- 红色史实术语坚持“人工精校 + 教师审核”，翻译接口中的 Demo 结果不会冒充第三方机器翻译；
- 前端保留 mock 数据结构，可直接把请求指向本后端完成联调；
- 生产环境建议把 `HERIGUIDE_SEED_DEMO` 设为 `false`，并使用 Alembic 管理迁移。
