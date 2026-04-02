import React, { useState } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { app } from '../../utils/cloudbase';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (e.g., 5MB limit)
    if (!file.type.startsWith('image/')) {
      setError('只能上传图片文件');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      // Generate a unique file name
      const ext = file.name.split('.').pop();
      const cloudPath = `admin-uploads/${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
      
      // Upload to CloudBase Storage
      const res = await app.uploadFile({
        cloudPath,
        filePath: file as any // Web environment takes File object directly
      });
      
      // Get temporary download URL
      const tempUrlRes = await app.getTempFileURL({
        fileList: [res.fileID]
      });
      
      const fileUrl = tempUrlRes.fileList[0].tempFileURL;
      onChange(fileUrl);
    } catch (err: any) {
      console.error('上传失败:', err);
      setError(err.message || '图片上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      {value ? (
        <div className="relative w-full h-32 rounded-lg border border-gray-200 overflow-hidden group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-white/20 p-2 rounded-full hover:bg-white/40 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-500">
              {uploading ? '正在上传...' : <><span className="font-semibold text-primary-600">点击上传</span> 或拖拽图片至此处</>}
            </p>
            <p className="text-xs text-gray-400 mt-1">支持 JPG, PNG (最大 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
