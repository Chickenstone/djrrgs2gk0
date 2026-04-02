import React, { useState, useEffect } from 'react';
import { db } from '../../../utils/cloudbase';
import { DataTable, Column } from '../../../components/ui/DataTable';

interface Booking {
  _id: string;
  package_id: number;
  package_title: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  create_time: any; // Date or CloudBase timestamp
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: '已接单', color: 'bg-blue-100 text-blue-800' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-800' },
};

export function BookingsAdmin() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await db.collection('bookings').orderBy('create_time', 'desc').limit(50).get();
      setData(res.data as Booking[]);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`确定将状态更改为 ${statusMap[newStatus].label} 吗？`)) return;
    try {
      await db.collection('bookings').doc(id).update({ status: newStatus });
      fetchBookings();
    } catch (err) {
      console.error('Update error:', err);
      alert('状态更新失败');
    }
  };

  const columns: Column<Booking>[] = [
    { key: 'customer_name', title: '客户姓名' },
    { key: 'customer_phone', title: '联系电话' },
    { key: 'package_title', title: '预约服务', className: 'max-w-[200px] truncate' },
    { key: 'booking_date', title: '出行日期' },
    { 
      key: 'status', 
      title: '状态',
      render: (item) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[item.status]?.color || 'bg-gray-100'}`}>
          {statusMap[item.status]?.label || item.status}
        </span>
      )
    },
    {
      key: 'actions',
      title: '操作流转',
      render: (item) => (
        <select
          value={item.status}
          onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
          className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
        >
          <option value="pending">待处理</option>
          <option value="confirmed">已接单</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">服务预约管理</h1>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyText="暂无服务预约"
      />
    </div>
  );
}
