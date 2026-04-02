import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MobileLayout } from './components/layout/MobileLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AuthGuard } from './components/auth/AuthGuard';
import { Home } from './pages/home';
import { Government } from './pages/government';
import { Food } from './pages/food';
import { Travel } from './pages/travel';
import { Service } from './pages/service';
import { Culture } from './pages/culture';
import { User } from './pages/user';
import { AdminDashboard } from './pages/admin/dashboard';
import { AdminLogin } from './pages/admin/login';
import { RestaurantsAdmin } from './pages/admin/restaurants';
import { SpotsAdmin } from './pages/admin/spots';
import { ProductsAdmin } from './pages/admin/products';
import { BookingsAdmin } from './pages/admin/bookings';
import { SystemSettings } from './pages/admin/settings';

function AnimatedRoutes() {
  const location = useLocation();
  // 根据是否为后台路由来决定顶层动画的 key，避免在移动端标签页切换时触发全局重渲染
  const baseKey = location.pathname.startsWith('/admin') ? '/admin' : '/';
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={baseKey}>
        {/* 前端移动端路由 */}
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Home />} />
          <Route path="government" element={<Government />} />
          <Route path="food" element={<Food />} />
          <Route path="travel" element={<Travel />} />
          <Route path="service" element={<Service />} />
          <Route path="culture" element={<Culture />} />
          <Route path="user" element={<User />} />
        </Route>

        {/* 后台登录路由 */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 后台管理受保护路由 */}
        <Route element={<AuthGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="restaurants" element={<RestaurantsAdmin />} />
            <Route path="spots" element={<SpotsAdmin />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="bookings" element={<BookingsAdmin />} />
            <Route path="settings" element={<SystemSettings />} />
            {/* 其他管理页面在此添加 */}
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
