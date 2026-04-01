# 东兴便民通 - 代码维基 (Code Wiki)

## 1. 整体项目架构
本项目是一个采用“移动端优先”策略构建的 Web 应用，旨在模拟微信小程序的交互体验。它为广西东兴市量身定制，是一个涵盖政务、美食、旅游攻略、一条龙服务和文创抽奖等功能的综合性生活服务与跨境旅游平台。

**技术栈:**
- **前端框架:** React 18
- **构建工具:** Vite
- **路由管理:** React Router DOM v7 (单页应用架构 SPA)
- **样式方案:** Tailwind CSS (实用类优先，响应式设计), Lucide React (矢量图标库)
- **后端服务 (BaaS):** 腾讯云开发 CloudBase (提供 NoSQL 云数据库和身份验证能力)
- **状态管理:** 使用 React Hooks 进行局部状态管理，通过 `@cloudbase/js-sdk` 进行全局用户会话管理。

## 2. 核心模块与职责
应用程序按业务领域划分为多个独立模块，可通过底部导航栏 (`MobileLayout`) 切换访问。

- **首页模块 (`/src/pages/home`)**:
  - 应用程序的主入口。
  - 提供全局搜索框、顶部轮播图、各功能模块的快速导航入口，以及信息流推荐列表。
- **政务模块 (`/src/pages/government`)**:
  - 静态展示东兴市政府相关的办事指南，例如：越南落地签申请指南、电子网格证申领等。
- **美食模块 (`/src/pages/food`)**:
  - 展示东兴本地特色美食及餐饮信息。
  - 动态从腾讯云开发数据库 (`restaurants` 集合) 获取数据。
  - 包含餐厅分类过滤功能，以及基于“拥挤度”的智能标签和热力图引导提示。
- **旅游攻略模块 (`/src/pages/travel`)**:
  - 为金滩、京族三岛等本地景点提供智慧旅游指南。
  - 动态从腾讯云开发数据库 (`spots` 集合) 获取景点数据。
  - 集成实时天气、景点客流监控看板，以及 AI 动态行程规划入口。
- **一条龙服务模块 (`/src/pages/service`)**:
  - 提供透明的跨境旅游服务包展示（如：跨境一日游、金牌买手导购等）。
  - 需要用户通过腾讯云开发进行身份验证（登录）后方可使用。
  - 处理用户预约表单的提交，并将数据写入腾讯云开发数据库的 `bookings` 集合。
- **文创商城模块 (`/src/pages/culture`)**:
  - 展示本地特色文创商品及非遗纪念品。
  - 动态从腾讯云开发数据库 (`products` 集合) 获取商品数据。
  - 包含游戏化互动元素，如非遗景点打卡任务以获取积分兑换奖励。
- **个人中心模块 (`/src/pages/user`)**:
  - 管理用户的个人资料和应用状态。
  - 处理腾讯云开发的身份认证逻辑（模拟微信一键登录/退出登录/匿名静默登录）。
  - 展示用户的订单状态面板、各项服务（如政务、电子凭证）的快捷入口。

## 3. 核心类与函数说明

- **`src/utils/cloudbase.ts`**:
  - `app`: 腾讯云开发 (CloudBase) 实例，通过环境变量 `VITE_CLOUDBASE_ENV_ID` 初始化。
  - `auth`: CloudBase 身份验证实例 (`app.auth()`)，开启了本地持久化 (`persistence: 'local'`)。
  - `db`: CloudBase 数据库实例 (`app.database()`)，用于执行数据的增删改查操作。
  - `signInAnonymously()`: 辅助函数。当用户未主动登录时，静默执行匿名登录。这确保了即便是游客身份，也能成功获得对云数据库的读取权限（需配合数据库的安全规则配置）。
- **`src/components/layout/MobileLayout.tsx`**:
  - `MobileLayout`: 核心的页面布局包装器组件。它使用 React Router 的 `<Outlet />` 来渲染当前匹配的页面内容，并固定在底部渲染一个跨页面的导航栏 (`nav`)。
- **`src/App.tsx`**:
  - 根组件，配置了 `BrowserRouter`。它负责将所有的 URL 路径路由映射到 `MobileLayout` 下对应的具体页面组件。

## 4. 依赖关系
- **UI 与 DOM 渲染**: 依赖 `react` 和 `react-dom`。`react-router-dom` 拦截浏览器的 URL 变化，实现在不刷新页面的情况下切换模块视图。
- **样式构建流水线**: `tailwindcss` 协同 `postcss` 和 `autoprefixer` 处理 CSS 实用类。在组件中大量使用 `clsx` 和 `tailwind-merge` 来动态合并并应用条件 CSS 类名，避免样式冲突。`lucide-react` 用于向 DOM 中直接注入 SVG 图标。
- **后端连接层**: `@cloudbase/js-sdk` 被深度集成到各个业务组件中 (`Food`, `Travel`, `Culture`, `Service`, `User`)。它让前端可以直接与腾讯云通信，替代了传统的 REST API 模式，用于数据读取 (`db.collection().get()`)、数据写入和用户会话管理 (`auth.getLoginState()`)。
- **开发与构建工具**: `vite` 负责驱动本地开发服务器（提供热更新 HMR）和生产环境的打包构建。`typescript` 提供了包括 CloudBase 数据模型在内的强类型检查。

## 5. 项目运行指南

1. **环境准备**: 确保你的计算机上已安装 Node.js (推荐 v18 或以上版本)。
2. **安装依赖**:
   在项目根目录下执行：
   ```bash
   npm install
   ```
3. **环境变量配置**:
   在项目根目录创建一个名为 `.env.local` 的文件，并填入你的腾讯云开发环境 ID：
   ```env
   VITE_CLOUDBASE_ENV_ID=你的环境ID
   ```
4. **云数据库设置**:
   进入腾讯云开发控制台，创建以下四个集合（Collection）以使页面能正常加载和写入数据：
   - `restaurants` (权限：所有用户可读)
   - `spots` (权限：所有用户可读)
   - `products` (权限：所有用户可读)
   - `bookings` (权限：所有用户可读，仅创建者及管理员可写)
5. **启动开发服务器**:
   ```bash
   npm run dev
   ```
   启动后，在浏览器中访问 `http://localhost:5173`。*(提示：建议在浏览器的开发者工具中开启“设备工具栏/移动端视图”，以获得最佳的响应式预览体验)。*
6. **生产环境构建**:
   ```bash
   npm run build
   ```
