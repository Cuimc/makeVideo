# Web Frontend

## 启动

```bash
pnpm --filter @make-video/web dev
```

## 环境变量

- `VITE_API_BASE_URL`
- `VITE_ENABLE_MOCK`

## 联调方式

- 后端未就绪时使用 `VITE_ENABLE_MOCK=true`
- 联调时关闭 mock，并把 `VITE_API_BASE_URL` 指向 Nest 服务地址

## 当前覆盖

- 登录、工作台、新闻选题、AI 创作、视频生成、任务中心
- 素材库、脚本参考库、成品库
- 个人中心、积分充值、积分明细
