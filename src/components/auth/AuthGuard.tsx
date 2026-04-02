import { Navigate, Outlet } from 'react-router-dom';

export function AuthGuard() {
  // 检查是否登录 (通过 sessionStorage 验证 mock 的管理员 token)
  const token = sessionStorage.getItem('admin_token');

  if (!token) {
    // 如果没有 token，跳转到登录页
    return <Navigate to="/admin/login" replace />;
  }

  // 渲染受保护的路由内容
  return <Outlet />;
}
