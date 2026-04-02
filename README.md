# 东兴便民通 - 微信小程序项目

本项目是一个为广西东兴市量身定制的综合性生活服务/跨境旅游小程序前端项目。采用“移动端优先”策略构建的 Web 应用，旨在模拟微信小程序的交互体验。涵盖了政务、美食、旅游攻略、一条龙服务和文创抽奖等五大核心模块。

## 🌟 核心功能模块

| 模块名称 | 对应页面路径 | 主要功能描述 |
| --- | --- | --- |
| **首页** | `src/pages/home/index.tsx` | 顶部轮播图展示、五大功能入口导航、为您推荐的图文信息流。 |
| **政务大厅** | `src/pages/government/index.tsx` | 展示东兴市政府相关的办事指南（如：越南落地签申请指南、电子网格证申领等）。 |
| **美食模块** | `src/pages/food/index.tsx` | 展示东兴本地特色美食（如：红姑娘红薯、京族海鲜等），支持基于拥挤度的智能标签提示，数据从**腾讯云开发**动态读取。 |
| **旅游攻略** | `src/pages/travel/index.tsx` | 包含 AI 动态行程规划入口、实时天气和景点客流监控看板，数据从**腾讯云开发**动态读取。 |
| **一条龙服务** | `src/pages/service/index.tsx` | 提供透明的跨境旅游服务包展示，支持在线填写**预约表单**，提交后数据会写入**腾讯云开发**数据库。 |
| **文创商城** | `src/pages/culture/index.tsx` | 包含非遗景点打卡任务和文创商品（如红木雕刻）的积分兑换展示，商品数据从**腾讯云开发**动态读取。 |
| **个人中心** | `src/pages/user/index.tsx` | 用户的订单状态展示、预约记录入口。集成了**腾讯云开发**的用户登录状态管理逻辑。 |

## 🛠️ 技术栈与架构

*   **前端框架**: React 18
*   **构建工具**: Vite
*   **路由管理**: React Router DOM v7 (单页应用架构 SPA)
*   **样式方案**: Tailwind CSS (实用类优先，响应式设计), Lucide React (矢量图标库)
*   **后端服务 (BaaS)**: 腾讯云开发 CloudBase (提供 NoSQL 云数据库和身份验证能力)
*   **状态管理**: 使用 React Hooks 进行局部状态管理，通过 `@cloudbase/js-sdk` 进行全局用户会话管理。

## 📁 核心目录结构

```text
dxapp/
├── src/
│   ├── components/       # 公共组件（如底部导航栏 MobileLayout.tsx）
│   ├── pages/            # 所有的页面代码（分模块存放）
│   ├── utils/            # 工具函数（如 cloudbase.ts）
│   ├── App.tsx           # 全局路由配置文件
│   └── index.css         # 全局样式文件（引入了 Tailwind）
├── .env.local            # 环境变量配置（存放腾讯云环境 ID，不提交到 Git）
├── package.json          # 项目依赖配置文件
└── vite.config.ts        # Vite 构建工具配置
```

## 🚀 本地开发指南

1.  **环境准备**: 确保你的计算机上已安装 Node.js (推荐 v18 或以上版本)。
2.  **安装依赖**:
    ```bash
    npm install
    ```
3.  **配置环境变量**:
    在项目根目录创建 `.env.local` 文件，填入您的腾讯云开发环境 ID：
    ```text
    VITE_CLOUDBASE_ENV_ID=您的环境ID
    ```
4.  **启动开发服务器**:
    ```bash
    npm run dev
    ```
    启动后在浏览器访问 `http://localhost:5173` 即可预览（建议开启浏览器开发者工具的移动端视图）。
5.  **生产环境构建**:
    ```bash
    npm run build
    ```

## ☁️ 腾讯云开发数据库配置

本项目依赖腾讯云开发的云数据库，需要在腾讯云控制台创建以下四个集合（Collection）才能正常显示和写入数据：
1.  **`restaurants`**: 存放美食页面的餐厅数据（权限：所有用户可读）。
2.  **`spots`**: 存放旅游攻略页面的景点数据（权限：所有用户可读）。
3.  **`products`**: 存放文创商城的商品数据（权限：所有用户可读）。
4.  **`bookings`**: 接收“一条龙服务”页面的用户预约提交数据（权限：所有用户可读，仅创建者及管理员可写）。

---

## 🔧 项目维护与修改指南

本项目采用了**前端页面+云端数据库**的架构。

### 1. 修改“动态数据”（美食、景点、文创等）
无需修改代码。请登录 [腾讯云开发控制台](https://console.cloud.tencent.com/tcb) -> “数据库”，在对应的集合（`restaurants`, `spots`, `products`）中添加、修改或删除记录，小程序端会自动同步。

### 2. 修改“静态界面与文案”
此类内容写死在前端代码中。
*   **首页轮播图与推荐**: 在 `src/pages/home/index.tsx` 修改 `CAROUSEL_IMAGES` 和 `RECOMMENDATIONS` 数组。
*   **政务指南列表**: 在 `src/pages/government/index.tsx` 修改 `SERVICES` 数组。
*   **服务包内容与价格**: 在 `src/pages/service/index.tsx` 修改 `PACKAGES` 数组。
*   **底部版权声明**: 在 `src/pages/user/index.tsx` 底部修改文本。

### 3. 修改“样式与颜色”
项目使用 Tailwind CSS。例如修改按钮颜色：将 `bg-blue-600` 修改为 `bg-red-600`。
*   **常用色彩规范**: 蓝色系（全局）、橙色系（美食）、绿色系（攻略）、红色系（文创）。

---

## ☁️ 部署指南 (腾讯云静态网站托管)

### 手动部署
1. 终端运行 `npm run build` 生成 `dist` 文件夹。
2. 登录腾讯云开发控制台，进入环境，开通并打开 **“静态网站托管”**。
3. 将 `dist` 文件夹内的**所有内容**上传覆盖旧文件。
4. 获取“基础配置”中的默认域名进行访问。

### 自动化部署 (GitHub Actions CI/CD)
本项目已配置 GitHub Actions 工作流。
1. 在 GitHub 仓库的 **Settings -> Secrets and variables -> Actions** 中添加以下 Secrets：
   * `TENCENT_SECRET_ID`: 腾讯云 API SecretId
   * `TENCENT_SECRET_KEY`: 腾讯云 API SecretKey
   * `TCB_ENV_ID`: 云开发环境 ID
2. 将代码推送至 `main` 分支后，系统将自动打包并部署到腾讯云静态网站托管。

---

## 🔗 仓库关联与部署架构说明

1. **唯一真理来源**: 本私有仓库 **`dxapp`** 是项目的核心代码库，所有开发、修改必须在此进行。
2. **公开部署仓库**: 外部公开仓库名称为 **`djrrgs2gk0`**，仅用于连接外部云平台自动部署。为保护隐私，它采用了随机码命名且不包含项目详细说明文档。
3. **同步规范**: 公开仓库的代码版本无条件以 `dxapp` 为准。严禁直接在 `djrrgs2gk0` 中修改代码。每次在 `dxapp` 测试通过后，再同步构建所需源码至 `djrrgs2gk0` 触发部署。