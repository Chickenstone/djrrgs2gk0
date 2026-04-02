import React from 'react';
import { Search, Building2, Utensils, Map as MapIcon, Wrench, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const MODULES = [
  { name: '政务大厅', path: '/government', icon: Building2, color: 'bg-primary-600' },
  { name: '美食天地', path: '/food', icon: Utensils, color: 'bg-orange-500' },
  { name: '旅游攻略', path: '/travel', icon: MapIcon, color: 'bg-green-500' },
  { name: '一条龙服务', path: '/service', icon: Wrench, color: 'bg-purple-500' },
  { name: '文创商城', path: '/culture', icon: ShoppingBag, color: 'bg-red-500' },
];

const RECOMMENDATIONS = [
  {
    id: 1,
    title: '越南落地签在线申请',
    desc: '快速通道，省时省力',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vietnam%20visa%20passport%20travel%20flat%20illustration&image_size=landscape_16_9',
    path: '/government'
  },
  {
    id: 2,
    title: '东兴特色红姑娘红薯',
    desc: '软糯香甜，本地直供',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=sweet%20potato%20local%20food%20illustration&image_size=landscape_16_9',
    path: '/culture'
  },
  {
    id: 3,
    title: '金滩一日游攻略',
    desc: '避开人流，独享海景',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beautiful%20beach%20sunset%20travel%20illustration&image_size=landscape_16_9',
    path: '/travel'
  }
];

export function Home() {
  return (
    <div className="flex flex-col min-h-full pb-6">
      {/* Header / Search */}
      <div className="bg-primary-600 pt-6 pb-4 px-4 sticky top-0 z-10 rounded-b-2xl shadow-sm">
        <h1 className="text-white text-xl font-bold mb-4">东兴便民通</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-full leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
            placeholder="搜索政务、美食、景点..."
          />
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 mt-4">
        <div className="w-full h-36 rounded-xl overflow-hidden shadow-md relative">
          <img 
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dongxing%20city%20border%20gate%20travel%20illustration%20vibrant%20colors&image_size=landscape_16_9" 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-4">
              <h2 className="text-white font-bold text-lg">中越边境游 尽在东兴</h2>
              <p className="text-white/80 text-sm">一站式服务，畅享跨境之旅</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="px-4 mt-6">
        <h3 className="text-gray-800 font-bold mb-4 px-1">核心服务</h3>
        <motion.div 
          className="grid grid-cols-5 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {MODULES.map((module) => (
            <motion.div key={module.path} variants={itemVariants}>
              <Link 
                to={module.path}
                className="flex flex-col items-center group transition-all duration-200 active:scale-95 hover:scale-[1.02] hover:shadow-md cursor-pointer rounded-xl p-1"
              >
                <div className={`${module.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm mb-2 transform transition-transform group-hover:scale-105`}>
                  <module.icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-700 font-medium text-center">{module.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recommended */}
      <div className="px-4 mt-8 flex-1">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-gray-800 font-bold">为您推荐</h3>
          <span className="text-xs text-gray-500">查看更多 &gt;</span>
        </div>
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {RECOMMENDATIONS.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Link to={item.path} className="flex bg-white rounded-xl shadow-sm overflow-hidden p-2 border border-gray-100 transition-all duration-200 active:scale-95 hover:scale-[1.02] hover:shadow-md cursor-pointer">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="ml-3 flex flex-col justify-center flex-1">
                  <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                  <div className="mt-2 flex justify-end">
                    <span className="text-[10px] px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                      立即查看
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
