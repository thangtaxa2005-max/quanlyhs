"use client";

import { useState, useEffect } from "react";
import AttendanceTable from "./AttendanceTable";

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [classes, setClasses] = useState<any[]>([]);

  // Set ngày mặc định là hôm nay
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // Giả sử lấy danh sách lớp từ API (sau này sẽ gọi thật)
  useEffect(() => {
    // TODO: Gọi API lấy danh sách lớp
    setClasses([
      { id: 1, class_name: "10A1" },
      { id: 2, class_name: "10A2" },
      { id: 3, class_name: "11B1" },
    ]);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Điểm Danh Học Sinh
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Chọn lớp và ngày để điểm danh nhanh
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Chọn Lớp</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn lớp --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chọn Ngày</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                /* sau sẽ gọi API */
              }}
              disabled={!selectedClass || !selectedDate}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition"
            >
              Tải Danh Sách Điểm Danh
            </button>
          </div>
        </div>
      </div>

      {/* Bảng điểm danh */}
      {selectedClass && selectedDate && (
        <AttendanceTable
          classId={parseInt(selectedClass)}
          date={selectedDate}
        />
      )}
    </div>
  );
}
