import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { db } from '../../../utils/cloudbase';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ImageUpload } from '../../../components/ui/ImageUpload';

interface Restaurant {
  _id?: string;
  name: string;
  category: string;
  rating: number;
  crowdLevel: 'low' | 'medium' | 'high';
  distance: string;
  time: string;
  image: string;
  tags: string[];
}

export function RestaurantsAdmin() {
  const [data, setData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Restaurant | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await db.collection('restaurants').limit(50).get();
      setData(res.data as Restaurant[]);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload: Omit<Restaurant, '_id'> = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      rating: Number(formData.get('rating')),
      crowdLevel: formData.get('crowdLevel') as 'low' | 'medium' | 'high',
      distance: formData.get('distance') as string,
      time: formData.get('time') as string,
      image: imageUrl || (formData.get('image') as string),
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (editingItem?._id) {
        await db.collection('restaurants').doc(editingItem._id).update(payload);
      } else {
        await db.collection('restaurants').add(payload);
      }
      setIsModalOpen(false);
      fetchRestaurants();
    } catch (err) {
      console.error('Save error:', err);
      alert('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除吗？')) return;
    try {
      await db.collection('restaurants').doc(id).remove();
      fetchRestaurants();
    } catch (err) {
      console.error('Delete error:', err);
      alert('删除失败');
    }
  };

  const columns: Column<Restaurant>[] = [
    { key: 'name', title: '餐厅名称' },
    { key: 'category', title: '分类' },
    { key: 'rating', title: '评分' },
    { 
      key: 'crowdLevel', 
      title: '拥挤度',
      render: (item) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.crowdLevel === 'low' ? 'bg-green-100 text-green-800' :
          item.crowdLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.crowdLevel === 'low' ? '空闲' : item.crowdLevel === 'medium' ? '适中' : '拥挤'}
        </span>
      )
    },
    {
      key: 'actions',
      title: '操作',
      render: (item) => (
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setEditingItem(item);
              setImageUrl(item.image);
              setIsModalOpen(true);
            }}
            className="text-primary-600 hover:text-primary-900"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => item._id && handleDelete(item._id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">美食管理</h1>
        <button
            onClick={() => {
              setEditingItem(null);
              setImageUrl('');
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增餐厅
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? '编辑餐厅' : '新增餐厅'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">餐厅名称</label>
            <input type="text" name="name" defaultValue={editingItem?.name} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">分类</label>
              <input type="text" name="category" defaultValue={editingItem?.category} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">评分</label>
              <input type="number" step="0.1" name="rating" defaultValue={editingItem?.rating || 5.0} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">拥挤度</label>
              <select name="crowdLevel" defaultValue={editingItem?.crowdLevel || 'low'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border">
                <option value="low">空闲</option>
                <option value="medium">适中</option>
                <option value="high">拥挤</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">营业时间</label>
              <input type="text" name="time" defaultValue={editingItem?.time} placeholder="10:00-22:00" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">距离</label>
            <input type="text" name="distance" defaultValue={editingItem?.distance} placeholder="500m" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">标签 (逗号分隔)</label>
            <input type="text" name="tags" defaultValue={editingItem?.tags?.join(', ')} placeholder="现杀现做, 海鲜" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">图片</label>
            <ImageUpload 
              value={imageUrl || editingItem?.image} 
              onChange={setImageUrl} 
              className="mt-1"
            />
            <input type="hidden" name="image" value={imageUrl || editingItem?.image || ''} />
          </div>
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
              保存
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              取消
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
