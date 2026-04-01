import React from 'react';
import { FileText, Calendar, Clock, AlertCircle, ChevronRight, FileBadge, Globe } from 'lucide-react';

const SERVICES = [
  { id: 1, title: '越南落地签申请', desc: '在线提报材料，快速办理', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 2, title: '电子网格证申领', desc: '智慧通关，快速通行', icon: FileBadge, color: 'text-green-500', bg: 'bg-green-100' },
  { id: 3, title: '旅游纠纷投诉', desc: '极速响应，维权通道', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
];

export function Government() {
  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white pt-6 pb-12 px-4 rounded-b-3xl shadow-sm">
        <h1 className="text-xl font-bold mb-2">政务服务大厅</h1>
        <p className="text-sm text-blue-100">东兴市智慧化管理平台</p>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-8 flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              办事指南
            </h3>
            <div className="space-y-3">
              {SERVICES.map((service) => (
                <div key={service.id} className="flex items-center p-3 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className={`${service.bg} p-2 rounded-lg mr-3`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{service.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{service.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
