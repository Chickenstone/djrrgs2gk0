import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { db } from '../../../utils/cloudbase';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ImageUpload } from '../../../components/ui/ImageUpload';

interface Product {
  _id?: string;
  name: string;
  points: number;
  price: string;
  image: string;
  type: string;
}

export function ProductsAdmin() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await db.collection('products').limit(50).get();
      setData(res.data as Product[]);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload: Omit<Product, '_id'> = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      points: Number(formData.get('points')),
      price: formData.get('price') as string,
      image: imageUrl || (formData.get('image') as string),
    };

    try {
      if (editingItem?._id) {
        await db.collection('products').doc(editingItem._id).update(payload);
      } else {
        await db.collection('products').add(payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Save error:', err);
      alert('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除吗？')) return;
    try {
      await db.collection('products').doc(id).remove();
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      alert('删除失败');
    }
  };

  const columns: Column<Product>[] = [
    { key: 'name', title: '商品名称' },
    { key: 'type', title: '类型标签' },
    { key: 'points', title: '兑换积分' },
    { key: 'price', title: '参考原价 (¥)' },
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
        <h1 className="text-2xl font-bold text-gray-900">文创商品管理</h1>
        <button
            onClick={() => {
              setEditingItem(null);
              setImageUrl('');
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增商品
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
        title={editingItem ? '编辑商品' : '新增商品'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">商品名称</label>
            <input type="text" name="name" defaultValue={editingItem?.name} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">类型标签</label>
              <input type="text" name="type" defaultValue={editingItem?.type} placeholder="非遗 / 限量 / 热销" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">兑换所需积分</label>
              <input type="number" name="points" defaultValue={editingItem?.points} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">参考原价</label>
            <input type="text" name="price" defaultValue={editingItem?.price} placeholder="99" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
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
