import React, { useState, useEffect } from 'react';
import { Map, Navigation, Sun, Users, ArrowRight } from 'lucide-react';
import { db, signInAnonymously } from '../../utils/cloudbase';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface Spot {
  _id: string;
  name: string;
  desc: string;
  image: string;
  crowd: 'low' | 'medium' | 'high';
  weather: string;
  tags: string[];
}

export function Travel() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpots() {
      try {
        setLoading(true);
        await signInAnonymously();
        const res = await db.collection('spots').limit(10).get();
        
        if (res.data && res.data.length > 0) {
          setSpots(res.data as Spot[]);
        } else {
          // Fallback data
          setSpots([
            {
              _id: 'mock_1',
              name: '金滩 (云端无数据)',
              desc: '十里金滩，浪漫落日',
              image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beautiful%20golden%20beach%20sunset%20travel&image_size=landscape_4_3',
              crowd: 'high',
              weather: '晴 28°C',
              tags: ['海滨风光', '摄影胜地']
            },
            {
              _id: 'mock_2',
              name: '京族三岛 (万尾哈亭)',
              desc: '体验纯正京族风情与非遗文化',
              image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20chinese%20ethnic%20village%20cultural%20heritage&image_size=landscape_4_3',
              crowd: 'low',
              weather: '晴 27°C',
              tags: ['非遗文化', '小众秘境']
            }
          ]);
        }
      } catch (err: any) {
        console.error('获取景点数据失败:', err);
        setError(err.message || '获取数据失败');
      } finally {
        setLoading(false);
      }
    }

    fetchSpots();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-green-500 text-white pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold mb-4">智慧旅游攻略</h1>
        
        {/* Dynamic Route Planner Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              <span className="font-medium">AI 动态行程规划</span>
            </div>
            <span className="text-xs bg-green-400 px-2 py-0.5 rounded-full">实时数据</span>
          </div>
          <p className="text-xs text-white/90 mb-3 line-clamp-2">
            当前金滩客流超载，建议前往【京族三岛】体验非遗文化，畅享“文化沉浸”之旅。
          </p>
          <button className="w-full bg-white text-green-600 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 shadow-sm">
            生成我的专属行程 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weather & Info Bar */}
      <div className="px-4 mt-4">
        <div className="flex gap-2">
          <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <div className="bg-primary-50 p-1.5 rounded-lg text-primary-500">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500">今日天气</div>
              <div className="text-sm font-bold text-gray-800">晴 28°C</div>
            </div>
          </div>
          <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <div className="bg-orange-50 p-1.5 rounded-lg text-orange-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500">全市客流</div>
              <div className="text-sm font-bold text-gray-800">较拥挤</div>
            </div>
          </div>
        </div>
      </div>

      {/* Spots List */}
      <div className="px-4 mt-6 flex-1">
        <h3 className="font-bold text-gray-800 mb-4 px-1">热门景点实时看板</h3>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">正在加载景点数据...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 text-sm">{error}</div>
          ) : (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {spots.map((spot) => (
                <motion.div 
                  key={spot._id} 
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 active:scale-95 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                >
                  <div className="h-32 relative">
                    <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="font-bold">{spot.name}</h4>
                      <p className="text-xs text-white/80">{spot.desc}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {spot.weather}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          spot.crowd === 'low' ? 'bg-green-50 text-green-600' :
                          spot.crowd === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {spot.crowd === 'low' ? '客流舒适' : spot.crowd === 'medium' ? '客流适中' : '客流拥挤'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {spot.tags?.map(tag => (
                        <span key={tag} className="text-[10px] border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 border-t border-gray-50 pt-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">详情</button>
                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600">去这里</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
