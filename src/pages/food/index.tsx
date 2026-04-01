import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Search } from 'lucide-react';
import { db, signInAnonymously } from '../../utils/cloudbase';

// 假设我们的集合名称为 'restaurants'
// 在真实环境中，您需要在腾讯云开发控制台创建这个集合并导入数据
interface Restaurant {
  _id: string;
  name: string;
  rating: number;
  reviews: number;
  category: string;
  distance: string;
  time: string;
  image: string;
  crowdLevel: 'low' | 'medium' | 'high';
  tags: string[];
}

export function Food() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        // 1. 确保用户已登录（这里使用匿名登录以供游客读取数据）
        await signInAnonymously();

        // 2. 从腾讯云开发数据库读取 'restaurants' 集合
        const res = await db.collection('restaurants').limit(10).get();
        
        // 3. 更新状态
        if (res.data && res.data.length > 0) {
          setRestaurants(res.data as Restaurant[]);
        } else {
          // 如果数据库是空的，为了演示我们先使用假数据 fallback
          setRestaurants([
            {
              _id: 'mock_1',
              name: '东兴特色融合菜馆 (云端无数据)',
              rating: 4.8,
              reviews: 328,
              category: '中越融合菜',
              distance: '500m',
              time: '10:00-22:00',
              image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vietnamese%20pho%20noodles%20food%20photography&image_size=landscape_4_3',
              crowdLevel: 'low',
              tags: ['红姑娘红薯', '风吹饼']
            },
            {
              _id: 'mock_2',
              name: '京族海鲜大排档',
              rating: 4.6,
              reviews: 512,
              category: '海鲜',
              distance: '1.2km',
              time: '11:00-02:00',
              image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fresh%20seafood%20platter%20restaurant%20food&image_size=landscape_4_3',
              crowdLevel: 'high',
              tags: ['现杀现做', '夜宵']
            }
          ]);
        }
      } catch (err: any) {
        console.error('获取餐厅数据失败:', err);
        setError(err.message || '获取数据失败');
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-6">
      {/* Search Header */}
      <div className="bg-white pt-6 pb-3 px-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="搜索餐厅、菜品..."
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          <button className="whitespace-nowrap px-4 py-1.5 bg-orange-50 text-orange-600 text-sm rounded-full font-medium border border-orange-100">全部</button>
          <button className="whitespace-nowrap px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full border border-gray-200">中越融合</button>
          <button className="whitespace-nowrap px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full border border-gray-200">海鲜</button>
          <button className="whitespace-nowrap px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full border border-gray-200">小吃</button>
        </div>
      </div>

      {/* Heatmap Banner (Simulated) */}
      <div className="px-4 mt-3">
        <div className="bg-orange-50 rounded-xl p-3 flex items-center justify-between border border-orange-100">
          <div className="flex items-center gap-2">
            <MapPin className="text-orange-500 w-5 h-5" />
            <div>
              <h3 className="text-sm font-bold text-gray-800">避堵指南</h3>
              <p className="text-xs text-gray-500">当前口岸商圈就餐人数较多</p>
            </div>
          </div>
          <button className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-medium">查看热力图</button>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="px-4 mt-4 space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">正在加载美食数据...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        ) : (
          restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
              <div className="relative h-40">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    restaurant.crowdLevel === 'low' ? 'bg-green-500' : 
                    restaurant.crowdLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-[10px] font-medium text-gray-700">
                    {restaurant.crowdLevel === 'low' ? '空闲' : 
                     restaurant.crowdLevel === 'medium' ? '适中' : '拥挤'}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 text-lg">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded text-orange-600">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span>{restaurant.category}</span>
                  <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {restaurant.distance}</span>
                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {restaurant.time}</span>
                </div>
                <div className="flex gap-2 mb-3">
                  {restaurant.tags?.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 border border-gray-200 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                  <button className="px-4 py-1.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-sm">立即预订</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
