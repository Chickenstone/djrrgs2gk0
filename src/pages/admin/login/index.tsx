import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { auth } from '../../../utils/cloudbase';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 在实际项目中，应使用 CloudBase 的邮箱/密码登录，或自定义登录 (Custom Auth)
      // 这里作为纯前端演示，使用硬编码的简单校验，并将状态保存在 sessionStorage 中
      // 也可以通过请求云数据库中 `admins` 集合来校验密码（需注意安全规则）
      if (username === 'admin' && password === '123456') {
        // 模拟登录成功，保存一个标志
        sessionStorage.setItem('admin_token', 'mock_admin_token_123');
        
        // 确保匿名登录，以便有权限读取数据库
        const loginState = await auth.getLoginState();
        // @ts-ignore - 腾讯云 SDK 类型定义不完整
        const isAnon = loginState?.isAnonymous === true || loginState?.loginType === 'ANONYMOUS';
        if (!loginState || !isAnon) {
          await auth.anonymousAuthProvider().signIn();
        }

        navigate('/admin', { replace: true });
      } else {
        setError('用户名或密码错误 (提示: admin / 123456)');
      }
    } catch (err) {
      console.error('登录失败', err);
      setError('系统异常，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          东兴便民通 - 管理后台
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          请使用管理员账号登录
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                用户名
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2.5 border"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                密码
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2.5 border"
                  placeholder="123456"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-gray-400"
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
