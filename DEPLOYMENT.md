# 2048 游戏部署指南

## 部署到 GitHub Pages

### 步骤 1：创建 GitHub 仓库
1. 登录 GitHub，创建一个新的仓库（建议命名为 `2048-game`）
2. 确保仓库设置为 **Public**

### 步骤 2：推送代码到 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/2048-game.git

# 推送代码
git push -u origin master
```

### 步骤 3：启用 GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 找到 **Pages** 选项（在左侧菜单）
3. 在 **Source** 部分：
   - 选择 `main` 分支（或 `master` 分支）
   - 选择 `/root` 目录
4. 点击 **Save**

### 步骤 4：访问游戏

部署完成后，访问以下 URL：
```
https://your-username.github.io/2048-game/
```

## 本地运行

```bash
# 启动本地开发服务器
python -m http.server 8000

# 访问 http://localhost:8000
```

## 项目结构

```
2048-game/
├── index.html      # 主页面
├── style.css       # 样式文件
├── script.js       # 游戏逻辑
├── test.js         # 测试用例
└── .gitignore      # Git 忽略配置
```

## 游戏功能

- ✅ 4×4 棋盘布局
- ✅ 方块滑动合并（上下左右）
- ✅ 分数计算系统
- ✅ 最高分记录（本地存储）
- ✅ 胜利判定（合成 2048）
- ✅ 失败判定（无法移动）
- ✅ 键盘操作支持
- ✅ 触屏滑动支持
- ✅ 响应式设计