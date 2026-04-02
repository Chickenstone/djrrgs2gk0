import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { db } from '../../../utils/cloudbase';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ImageUpload } from '../../../components/ui/ImageUpload';

interface Spot {
  _id?: string;
  name: string;
  desc: string;
  image: string;
  crowd: 'low' | 'medium' | 'high';
  weather: string;
  tags: string[];
}

export function SpotsAdmin() {
  const [data, setData] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Spot | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const fetchSpots = async () => {
    try {
      setLoading(true);
      const res = await db.collection('spots').limit(50).get();
      setData(res.data as Spot[]);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload: Omit<Spot, '_id'> = {
      name: formData.get('name') as string,
      desc: formData.get('desc') as string,
      crowd: formData.get('crowd') as 'low' | 'medium' | 'high',
      weather: formData.get('weather') as string,
      image: imageUrl || (formData.get('image') as string),
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (editingItem?._id) {
        await db.collection('spots').doc(editingItem._id).update(payload);
      } else {
        await db.collection('spots').add(payload);
      }
      setIsModalOpen(false);
      fetchSpots();
    } catch (err) {
      console.error('Save error:', err);
      alert('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除吗？')) return;
    try {
      await db.collection('spots').doc(id).remove();
      fetchSpots();
    } catch (err) {
      console.error('Delete error:', err);
      alert('删除失败');
    }
  };

  const columns: Column<Spot>[] = [
    { key: 'name', title: '景点名称' },
    { key: 'desc', title: '简介', className: 'max-w-xs truncate' },
    { key: 'weather', title: '当前天气' },
    { 
      key: 'crowd', 
      title: '客流状态',
      render: (item) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.crowd === 'low' ? 'bg-green-100 text-green-800' :
          item.crowd === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.crowd === 'low' ? '舒适' : item.crowd === 'medium' ? '适中' : '拥挤'}
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
            className="text-blue-600 hover:text-blue-900"
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
        <h1 className="text-2xl font-bold text-gray-900">景点管理</h1>
        <button
            onClick={() => {
              setEditingItem(null);
              setImageUrl('');
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增景点
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
        title={editingItem ? '编辑景点' : '新增景点'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">景点名称</label>
            <input type="text" name="name" defaultValue={editingItem?.name} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">简介</label>
            <textarea name="desc" defaultValue={editingItem?.desc} rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">客流状态</label>
              <select name="crowd" defaultValue={editingItem?.crowd || 'low'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                <option value="low">舒适</option>
                <option value="medium">适中</option>
                <option value="high">拥挤</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">当前天气</label>
              <input type="text" name="weather" defaultValue={editingItem?.weather} placeholder="晴 28°C" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">标签 (逗号分隔)</label>
            <input type="text" name="tags" defaultValue={editingItem?.tags?.join(', ')} placeholder="海滨风光, 摄影胜地" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
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
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              保存
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              取消
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
