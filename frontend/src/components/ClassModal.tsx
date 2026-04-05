'use client';

import { useState, useEffect } from 'react';
import { Class } from '@/services/classApi';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Class>) => void;
  initialData?: Class | null;
  title: string;
}

export default function ClassModal({ isOpen, onClose, onSave, initialData, title }: ClassModalProps) {
  const [formData, setFormData] = useState<Partial<Class>>({
    name: '',
    grade: 10,
    academicYear: new Date().getFullYear().toString(),
    homeroomTeacher: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        grade: 10,
        academicYear: new Date().getFullYear().toString(),
        homeroomTeacher: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tên lớp *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Ví dụ: 10A1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Khối *</label>
            <select
              value={formData.grade || 10}
              onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={10}>Lớp 10</option>
              <option value={11}>Lớp 11</option>
              <option value={12}>Lớp 12</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Năm học *</label>
            <input
              type="text"
              value={formData.academicYear || ''}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Ví dụ: 2024-2025"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Giáo viên chủ nhiệm</label>
            <input
              type="text"
              value={formData.homeroomTeacher || ''}
              onChange={(e) => setFormData({ ...formData, homeroomTeacher: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tên giáo viên"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}