import { useState } from 'react';
import { Database, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '../../../utils/cloudbase';

// 导入本地 JSON 数据，Vite 默认支持 JSON 导入。这里需要稍微处理一下按行分隔的 JSON
import rawRestaurants from '../../../../restaurants.json?raw';
import rawSpots from '../../../../spots.json?raw';
import rawProducts from '../../../../products.json?raw';

// 辅助函数：将按行分隔的 JSON 字符串解析为数组
const parseJsonLines = (raw: string) => {
  return raw.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line));
};

export function SystemSettings() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type: 'idle' | 'success' | 'error', message: string}>({ type: 'idle', message: '' });

  const handleInitData = async () => {
    if (!confirm('这将会向云端数据库写入初始数据。为了避免重复，如果已经有数据建议不要执行。确定要继续吗？')) {
      return;
    }

    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const restaurants = parseJsonLines(rawRestaurants);
      const spots = parseJsonLines(rawSpots);
      const products = parseJsonLines(rawProducts);

      // 并发写入美食数据
      const restPromises = restaurants.map(item => db.collection('restaurants').add(item));
      // 并发写入景点数据
      const spotPromises = spots.map(item => db.collection('spots').add(item));
      // 并发写入文创商品数据
      const prodPromises = products.map(item => db.collection('products').add(item));

      await Promise.all([
        ...restPromises,
        ...spotPromises,
        ...prodPromises
      ]);

      setStatus({ type: 'success', message: `成功导入 ${restaurants.length} 个餐厅，${spots.length} 个景点，${products.length} 个商品！` });
    } catch (err: any) {
      console.error('初始化数据失败:', err);
      setStatus({ type: 'error', message: err.message || '导入数据时发生未知错误' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-500 mt-1">管理系统全局配置和数据维护操作。</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            数据初始化
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              将项目本地的 JSON 数据文件（restaurants.json, spots.json, products.json）一键导入到腾讯云开发数据库中。
            </p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={handleInitData}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  正在导入数据...
                </>
              ) : (
                '导入初始数据'
              )}
            </button>
          </div>

          {status.type !== 'idle' && (
            <div className={`mt-4 p-4 rounded-md flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
              {status.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <div>
                <h4 className={`text-sm font-medium ${status.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {status.type === 'success' ? '导入成功' : '导入失败'}
                </h4>
                <div className={`mt-1 text-sm ${status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {status.message}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
