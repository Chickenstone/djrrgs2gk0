import React, { useState, useEffect } from 'react';
import { User as UserIcon, FileText, Calendar, ShoppingBag, Settings, ChevronRight, MessageSquare, CreditCard, LogOut } from 'lucide-react';
import { auth, app } from '../../utils/cloudbase';

export function User() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginState();
  }, []);

  const checkLoginState = async () => {
    try {
      setLoading(true);
      const loginState = await auth.getLoginState();
      // 判断是否是真的登录用户（通过检查是否有 loginType 且不为 'ANONYMOUS'，或者简单判断是否有 user.uid 且非匿名场景）
      // @ts-ignore - 腾讯云 SDK 类型定义不完整，我们强制读取 isAnonymous 属性或依赖上下文
      const isAnon = loginState?.isAnonymous === true || loginState?.loginType === 'ANONYMOUS';
      
      if (loginState && !isAnon) {
        setIsLoggedIn(true);
        // 这里为了演示，我们生成一个随机的用户名
        setUserInfo({
          nickname: `东兴游客_${Math.floor(Math.random() * 10000)}`,
          type: '普通用户',
          verified: false
        });
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    } catch (err) {
      console.error('获取登录状态失败', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      // 在微信小程序环境中，这里通常是调用微信授权登录
      // 在 Web 环境为了演示，我们使用微信公众号扫码登录或直接模拟登录
      // 这里为了快速演示，我们调用云开发的自定义登录或弹窗提示
      alert('在真实的微信小程序环境中，点击此处将调起微信一键登录授权。由于当前是 Web 预览环境，我们将为您模拟登录成功状态。');
      
      // 模拟登录成功状态
      setIsLoggedIn(true);
      setUserInfo({
        nickname: `微信用户_${Math.floor(Math.random() * 10000)}`,
        type: '认证用户',
        verified: true
      });
      
    } catch (err) {
      console.error('登录失败', err);
      alert('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      setIsLoggedIn(false);
      setUserInfo(null);
      // 退出后重新匿名登录以保证数据能正常读取
      await auth.anonymousAuthProvider().signIn();
    } catch (err) {
      console.error('退出登录失败', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-6">
      {/* Header Profile */}
      <div className="bg-primary-600 text-white pt-10 pb-12 px-6 rounded-b-[40px] shadow-sm relative z-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 overflow-hidden">
            {isLoggedIn ? (
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo?.nickname}`} alt="avatar" className="w-full h-full object-cover bg-white" />
            ) : (
              <UserIcon className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">
              {loading ? '加载中...' : (isLoggedIn ? userInfo?.nickname : '未登录')}
            </h2>
            <div className="flex gap-2">
              {isLoggedIn ? (
                <>
                  <span className="text-[10px] bg-primary-500 px-2 py-0.5 rounded-full border border-primary-400">
                    {userInfo?.type}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${userInfo?.verified ? 'bg-green-500 border-green-400' : 'bg-primary-500 border-primary-400'}`}>
                    {userInfo?.verified ? '已实名' : '未实名'}
                  </span>
                </>
              ) : (
                <span className="text-[10px] bg-primary-500/50 px-2 py-0.5 rounded-full border border-primary-400/50">
                  点击下方按钮登录
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Dashboard */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">我的订单</h3>
            <span className="text-xs text-gray-500 flex items-center">全部订单 <ChevronRight className="w-3 h-3" /></span>
          </div>
          <div className="flex justify-around">
            <div className="flex flex-col items-center gap-2 relative">
              <CreditCard className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-700">待付款</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">1</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-700">待使用</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MessageSquare className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-700">待评价</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-700">售后/退款</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="px-4 mt-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50 cursor-pointer" onClick={() => !isLoggedIn && alert('请先登录')}>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-gray-800">我的政务预约</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50 cursor-pointer" onClick={() => !isLoggedIn && alert('请先登录')}>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-800">跨境电子凭证</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50 cursor-pointer" onClick={() => !isLoggedIn && alert('请先登录')}>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-800">我的投诉/反馈</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-800">设置</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Login / Logout Button */}
      <div className="px-4 mt-6 mb-8">
        {!isLoggedIn ? (
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-primary-50 text-primary-600 py-3 rounded-xl text-sm font-bold shadow-sm active:bg-primary-100 transition-colors"
          >
            {loading ? '处理中...' : '微信一键登录'}
          </button>
        ) : (
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-50 text-red-500 py-3 rounded-xl text-sm font-bold shadow-sm active:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {loading ? '处理中...' : '退出登录'}
          </button>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-auto pb-6 text-center">
        <p className="text-[10px] text-gray-400">@chickenstone 当前小程序内容仅供体验，后续以正式上线为准</p>
      </div>
    </div>
  );
}
