import React, { useState, useEffect } from 'react';
import { Camera, Gift, Award, ShoppingCart, MapPin } from 'lucide-react';
import { db, signInAnonymously } from '../../utils/cloudbase';

interface Product {
  _id: string;
  name: string;
  points: number;
  price: string;
  image: string;
  type: string;
}

export function Culture() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        await signInAnonymously();
        const res = await db.collection('products').limit(10).get();
        
        if (res.data && res.data.length > 0) {
          setProducts(res.data as Product[]);
        } else {
          // Fallback data
          setProducts([
            {
              _id: 'mock_1',
              name: '中越友谊大桥金属模型 (云端无数据)',
              points: 500,
              price: '98',
              image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=metal%20bridge%20scale%20model%20souvenir%20product%20shot&image_size=square',
              type: '限量'
            },
            {
              _id: 'mock_2',
              name: '东兴红木雕刻摆件',
              points: 1200,
              price: '299',
              image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=wooden%20carving%20craft%20traditional%20chinese%20art&image_size=square',
              type: '非遗'
            },
            {
              _id: 'mock_3',
              name: '京族贝雕饰品',
              points: 300,
              price: '58',
              image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=seashell%20carving%20jewelry%20pendant%20craft&image_size=square',
              type: '热销'
            }
          ]);
        }
      } catch (err: any) {
        console.error('获取商品数据失败:', err);
        setError(err.message || '获取数据失败');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-6">
      {/* Header / Points */}
      <div className="bg-red-600 text-white pt-6 pb-16 px-4 rounded-b-3xl shadow-sm relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">文创商城</h1>
          <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs font-medium">购物车</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Award className="w-8 h-8 text-yellow-300" />
          </div>
          <div>
            <p className="text-sm text-red-100 mb-1">当前文旅积分</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">350</span>
              <span className="text-sm">分</span>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Mission */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-gray-800">非遗景点打卡任务</h3>
            </div>
            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">进行中 1/3</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">完成指定3处非遗景点（GPS+扫码双重验证），即可获得500积分及抽奖机会。</p>
          <button className="w-full bg-red-50 text-red-600 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-red-100 hover:bg-red-100 transition-colors">
            <Camera className="w-4 h-4" /> 扫码打卡
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 mt-6 flex-1">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-bold text-gray-800">积分兑换 / 文创商品</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Gift className="w-3 h-3" /> 参与投稿
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {loading ? (
            <div className="col-span-2 text-center py-10 text-gray-500 text-sm">正在加载商品数据...</div>
          ) : error ? (
            <div className="col-span-2 text-center py-10 text-red-500 text-sm">{error}</div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-square relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">
                    {product.type}
                  </span>
                </div>
                <div className="p-2.5">
                  <h4 className="font-medium text-gray-800 text-xs mb-2 line-clamp-2 h-8">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-red-500 font-bold text-sm flex items-center gap-0.5">
                        {product.points} <span className="text-[10px] font-normal">积分</span>
                      </div>
                      <div className="text-[10px] text-gray-400 line-through">¥{product.price}</div>
                    </div>
                    <button className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
