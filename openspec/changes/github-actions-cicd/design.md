# Design: GitHub Actions CI/CD 方案

## 1. 工作流设计

### 1.1 CI 工作流 (ci.yml)

触发条件：
- `push` 到 `main` 分支
- `pull_request` 到 `main` 分支

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm build
```

### 1.2 CD 工作流 (deploy.yml)

触发条件：
- `push` 到 `main` 分支（CI 成功后）

部署方式选择（使用原生命令，不依赖需要认证的 Actions）：

#### 选项 A: Cloudflare Pages（免费，无需认证）
```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: my-project
    directory: dist
```

#### 选项 B: Vercel（免费 CLI 部署）
```yaml
- name: Deploy to Vercel
  run: |
    npx vercel --token=${{ secrets.VERCEL_TOKEN }} --prod
```

#### 选项 C: GitHub Pages
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

## 2. 性能优化策略

### 2.1 依赖缓存
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'  # 自动缓存 pnpm store
```

### 2.2 pnpm 缓存
```yaml
- uses: pnpm/action-setup@v4
  with:
    version: 9

- name: Get pnpm store directory
  id: pnpm-cache
  run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_OUTPUT

- uses: actions/cache@v4
  with:
    path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-
```

### 2.3 并行任务
- 使用 `concurrency` 控制并发
- lint 和 build 可以并行（但 build 依赖类型检查）

### 2.4 触发优化
- 跳过文档-only 提交的 CI
- 使用 paths 过滤（可选）

## 3. 安全考虑

- 不使用需要 GITHUB_TOKEN 以外认证的 Actions
- 敏感信息通过 Secrets 管理
- 使用 `permissions` 限制 Action 权限

## 4. 验收标准

- [ ] CI 工作流在 PR 时自动运行
- [ ] 依赖缓存正常工作，二次构建加速
- [ ] Lint 和 Type check 都通过
- [ ] CD 工作流在 main push 时自动部署
- [ ] 部署使用原生命令或开源 Actions，不依赖需要全局配置的认证
- [ ] 构建时间优化（相比无缓存）
