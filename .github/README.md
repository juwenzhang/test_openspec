# GitHub Pages 部署配置

## 启用 GitHub Pages

1. 进入仓库 **Settings → Pages**
2. Source 选择 **GitHub Actions**（不要选择 branch）
3. 保存即可，Actions 会自动部署

## 工作流说明

### CI 工作流 (ci.yml)

- 触发: push/PR 到 main 分支
- 功能:
  - 安装依赖
  - 运行 lint 检查代码规范
  - 运行 build 进行类型检查和构建

### Deploy 工作流 (deploy.yml)

- 触发: push 到 main 分支
- 功能:
  - 构建项目
  - 使用 peaceiris/actions-gh-pages 自动推送到 gh-pages 分支
- 权限: 使用 GITHUB_TOKEN（自动生成，无需手动配置）

## 性能优化

- pnpm 依赖缓存：二次构建加速
- 并发控制：防止多个部署冲突
- 依赖版本锁定：使用 `--frozen-lockfile`

## 注意事项

- 无需手动配置 gh-pages 分支，Actions 会自动创建
- 首次运行可能需要 1-2 分钟
- 部署完成后访问 `https://<用户名>.github.io/<仓库名>/`
