# GitHub Pages 部署配置

## 启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 `gh-pages`，目录选择 `/ (root)`
4. 点击 Save

## 工作流说明

### CI 工作流 (ci.yml)

- 触发: push/PR 到 main 分支
- 功能:
  - 安装依赖
  - 运行 lint 检查代码规范
  - 运行 build 进行类型检查和构建

### Deploy 工作流 (deploy.yml)

- 触发: push 到 main 分支（CI 成功后）
- 功能:
  - 构建项目
  - 部署到 GitHub Pages
- 权限: 使用 GitHub Pages 原生 Actions，无需额外配置

## 性能优化

- pnpm 依赖缓存：二次构建加速
- 并发控制：防止多个部署冲突
- 依赖版本锁定：使用 `--frozen-lockfile`

## 注意事项

- 首次部署需要在 Settings 中启用 GitHub Pages
- 部署分支 `gh-pages` 由 Actions 自动管理，无需手动操作
