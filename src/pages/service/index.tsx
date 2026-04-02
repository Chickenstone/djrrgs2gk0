import React, { useState } from 'react';
import { ShieldCheck, Languages, Headphones, ChevronRight, Star, X } from 'lucide-react';
import { db, auth } from '../../utils/cloudbase';

const PACKAGES = [
  {
    id: 1,
    title: '东兴-芒街跨境一日游包',
    price: '299',
    tags: ['全包透明', '金牌导游', '0购物'],
    features: ['签证代办', '往返交通', '特色午餐', '全程翻译'],
    provider: '东兴国旅 (5A资质)',
    rating: 4.9,
    sales: 1250
  },
  {
    id: 2,
    title: '边贸集市金牌买手导购',
    price: '99',
    tags: ['本地通', '避坑指南'],
    features: ['红木鉴赏', '海鲜砍价', '特产打包', '物流代办'],
    provider: '东兴本地生活服务中心',
    rating: 4.8,
    sales: 856
  }
];

export function Service() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookClick = async (pkg: any) => {
    // 检查是否登录
    const loginState = await auth.getLoginState();
    // @ts-ignore - 腾讯云 SDK 类型定义不完整
    const isAnon = loginState?.isAnonymous === true || loginState?.loginType === 'ANONYMOUS';
    
    if (!loginState || isAnon) {
      alert('请先前往“我的”页面进行登录后再预约');
      return;
    }
    setSelectedPkg(pkg);
    setShowBookingForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert('请填写完整信息');
      return;
    }

    try {
      setIsSubmitting(true);
      // 写入腾讯云数据库
      await db.collection('bookings').add({
        package_id: selectedPkg.id,
        package_title: selectedPkg.title,
        customer_name: formData.name,
        customer_phone: formData.phone,
        booking_date: formData.date,
        notes: formData.notes,
        status: 'pending',
        create_time: new Date()
      });
      
      alert('预约成功！您的专属客服将很快与您联系。');
      setShowBookingForm(false);
      setFormData({ name: '', phone: '', date: '', notes: '' });
    } catch (err: any) {
      console.error('预约失败:', err);
      alert('预约失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-6 relative">
      {/* Header */}
      <div className="bg-purple-600 text-white pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold mb-4">一条龙服务</h1>
        <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
          <ShieldCheck className="w-8 h-8 text-green-300" />
          <div>
            <h2 className="text-sm font-bold">跨境消费电子凭证存证</h2>
            <p className="text-xs text-white/80 mt-0.5">全链条服务透明公示，平台担保权益</p>
          </div>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
          <div className="bg-primary-50 p-3 rounded-full">
            <Languages className="w-6 h-6 text-primary-500" />
          </div>
          <span className="text-sm font-medium text-gray-800">中越语音翻译</span>
          <span className="text-[10px] text-gray-500">无缝对接越南导游</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
          <div className="bg-orange-50 p-3 rounded-full">
            <Headphones className="w-6 h-6 text-orange-500" />
          </div>
          <span className="text-sm font-medium text-gray-800">专属在线客服</span>
          <span className="text-[10px] text-gray-500">行程问题极速响应</span>
        </div>
      </div>

      {/* Transparent Packages */}
      <div className="px-4 mt-6 flex-1">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-bold text-gray-800">透明服务包推荐</h3>
          <span className="text-xs text-gray-500">查看更多 &gt;</span>
        </div>
        <div className="space-y-4">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-4 border-b border-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800 text-base">{pkg.title}</h4>
                  <div className="text-purple-600 font-bold">
                    <span className="text-xs">¥</span>
                    <span className="text-lg">{pkg.price}</span>
                    <span className="text-xs text-gray-500 font-normal">/起</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  {pkg.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">包含服务：</p>
                  <div className="grid grid-cols-2 gap-2">
                    {pkg.features.map(feature => (
                      <div key={feature} className="flex items-center gap-1 text-xs text-gray-700">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50/50 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-800 font-medium mb-0.5">
                    <ShieldCheck className="w-3 h-3 text-primary-500" />
                    {pkg.provider}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <span className="flex items-center gap-0.5 text-orange-500"><Star className="w-3 h-3 fill-current" /> {pkg.rating}</span>
                    <span>已售 {pkg.sales}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleBookClick(pkg)}
                  className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-purple-700 transition-colors"
                >
                  立即预订
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">预约服务包</h3>
              <button onClick={() => setShowBookingForm(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-sm font-bold text-purple-800">{selectedPkg?.title}</p>
              <p className="text-xs text-purple-600 mt-1">¥{selectedPkg?.price} / 起</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">联系人姓名</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="请输入您的姓名"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">联系电话</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="请输入手机号码"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">出行日期</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">特殊需求 (选填)</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-20"
                  placeholder="如有忌口或特殊安排请备注"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-3 rounded-xl text-sm font-bold shadow-sm mt-4 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? '提交中...' : '确认预约并提交'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
