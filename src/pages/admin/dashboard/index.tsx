import { useState, useEffect } from 'react';
import { BarChart3, Users, Store, Map, ShoppingBag } from 'lucide-react';
import { db } from '../../../utils/cloudbase';

export function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    restaurants: 0,
    spots: 0,
    products: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resRes, spotsRes, prodRes, bookRes] = await Promise.all([
          db.collection('restaurants').count(),
          db.collection('spots').count(),
          db.collection('products').count(),
          db.collection('bookings').where({ status: 'pending' }).count()
        ]);
        
        setStatsData({
          restaurants: resRes.total || 0,
          spots: spotsRes.total || 0,
          products: prodRes.total || 0,
          pendingBookings: bookRes.total || 0
        });
      } catch (err) {
        console.error('Fetch stats error:', err);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { name: '入驻商家', value: statsData.restaurants, icon: Store, change: '+2.1%' },
    { name: '旅游景点', value: statsData.spots, icon: Map, change: '+0.0%' },
    { name: '文创商品', value: statsData.products, icon: ShoppingBag, change: '+5.4%' },
    { name: '待处理订单', value: statsData.pendingBookings, icon: BarChart3, change: '-1.2%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">数据大盘</h1>
        <p className="text-gray-500">欢迎来到东兴便民通后台管理系统。</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span
                  className={
                    stat.change.startsWith('+')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-2">较上月</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-6 min-h-[400px]">
        <h2 className="text-lg font-medium mb-4">近期活动与通知</h2>
        <div className="text-center text-gray-500 py-12">
          暂无最新通知
        </div>
      </div>
    </div>
  );
}
