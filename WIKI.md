# 东兴便民通 (Dongxing City Services App) - Code Wiki

## 1. Overall Project Architecture
The project is a mobile-first web application designed to simulate a WeChat Mini Program experience. It serves as a comprehensive lifestyle and cross-border tourism platform for Dongxing City.

**Technical Stack:**
- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM v7 (Single Page Application architecture)
- **Styling:** Tailwind CSS (utility-first, mobile-responsive), Lucide React (vector icons)
- **Backend-as-a-Service (BaaS):** Tencent CloudBase (provides NoSQL database and authentication capabilities)
- **State Management:** Handled locally via React hooks and globally for user sessions via `@cloudbase/js-sdk`.

## 2. Major Modules & Responsibilities
The application is structured into domain-specific modules, each accessible via the bottom navigation bar (`MobileLayout`).

- **Home Module (`/src/pages/home`)**:
  - The main portal dashboard.
  - Displays top search, promotional banners, quick links to other modules, and a curated recommendation feed.
- **Government Module (`/src/pages/government`)**:
  - Provides static guides for local government services, such as Vietnam visa on arrival applications and grid certificate claims.
- **Food Module (`/src/pages/food`)**:
  - Displays local Dongxing dining options.
  - Dynamically fetches restaurant data from Tencent CloudBase (`restaurants` collection).
  - Includes a UI for filtering and visualizing crowd levels (heatmaps).
- **Travel Module (`/src/pages/travel`)**:
  - Smart tourism planner for local spots like Golden Beach and Jing ethnic islands.
  - Fetches tourist spot data from CloudBase (`spots` collection).
  - Features real-time weather, crowd monitoring, and AI dynamic route planning UI.
- **Service Module (`/src/pages/service`)**:
  - One-stop shop for cross-border travel packages.
  - Requires user authentication via CloudBase.
  - Handles booking form submissions and writes user inputs to the CloudBase `bookings` collection.
- **Culture Module (`/src/pages/culture`)**:
  - Cultural product marketplace for local souvenirs and heritage items.
  - Fetches product data from CloudBase (`products` collection).
  - Includes gamified features like non-heritage site check-ins to earn points.
- **User Module (`/src/pages/user`)**:
  - Personal center managing user profile and state.
  - Handles CloudBase authentication (simulated WeChat login/logout/anonymous login).
  - Displays user dashboards like order status, service reservations, and settings.

## 3. Key Classes and Functions

- **`src/utils/cloudbase.ts`**:
  - `app`: The initialized CloudBase instance using the `VITE_CLOUDBASE_ENV_ID` environment variable.
  - `auth`: CloudBase authentication instance (`app.auth()`) with local persistence enabled.
  - `db`: CloudBase database instance (`app.database()`) used for CRUD operations.
  - `signInAnonymously()`: A helper function that silently authenticates users as guests. This ensures that read-access to CloudBase databases succeeds even for users who haven't explicitly logged in.
- **`src/components/layout/MobileLayout.tsx`**:
  - `MobileLayout`: The core layout wrapper component. It contains the React Router `<Outlet />` for rendering the active page and maintains the fixed bottom navigation bar (`nav`).
- **`src/App.tsx`**:
  - The root component that configures `BrowserRouter` and maps all URL paths to their respective module components under the `MobileLayout`.

## 4. Dependency Relationships
- **UI & DOM**: `react` and `react-dom` handle component rendering. `react-router-dom` intercepts URL changes to swap module views without page reloads.
- **Styling Pipeline**: `tailwindcss` processes utility classes alongside `postcss` and `autoprefixer`. `clsx` and `tailwind-merge` are heavily used to dynamically merge and apply conditional class strings without conflicts. `lucide-react` injects SVG icons directly into the DOM.
- **Backend Connectivity**: `@cloudbase/js-sdk` is deeply integrated into module components (`Food`, `Travel`, `Culture`, `Service`, `User`). It connects directly from the client to Tencent Cloud, replacing traditional REST APIs for data storage (`db.collection().get()`) and user sessions (`auth.getLoginState()`).
- **Development & Tooling**: `vite` orchestrates the build process and Hot Module Replacement (HMR). `typescript` provides interface definitions for CloudBase data models.

## 5. Instructions for Running the Project

1. **Prerequisites**: Ensure Node.js (v18+ recommended) is installed on your machine.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Configuration**:
   Create a `.env.local` file in the root directory and add your Tencent CloudBase environment ID:
   ```env
   VITE_CLOUDBASE_ENV_ID=your-env-id
   ```
4. **CloudBase Database Setup**:
   In your Tencent Cloud Console, create the following collections to enable dynamic data rendering:
   - `restaurants` (Permissions: All users can read)
   - `spots` (Permissions: All users can read)
   - `products` (Permissions: All users can read)
   - `bookings` (Permissions: All users can read, only creators/admins can write)
5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser. *(Tip: Toggle the Device Toolbar/Mobile View in browser Developer Tools for the intended responsive experience).*
6. **Build for Production**:
   ```bash
   npm run build
   ```
