"use client";

import { useState, useEffect } from "react";

type AttendanceStatus =
  | "present"
  | "absent_permission"
  | "absent_nopermission"
  | "late";

interface AttendanceRecord {
  id: number;
  studentId: number;
  fullName: string;
  status: AttendanceStatus;
  note?: string;
}

export default function AttendanceTable({
  classId,
  date,
}: {
  classId: number;
  date: string;
}) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Giả lập dữ liệu tạm thời (sau này sẽ gọi API)
  useEffect(() => {
    setTimeout(() => {
      setRecords([
        { id: 1, studentId: 101, fullName: "Nguyễn Văn An", status: "present" },
        { id: 2, studentId: 102, fullName: "Trần Thị Bình", status: "present" },
        { id: 3, studentId: 103, fullName: "Lê Hoàng Cường", status: "late" },
        {
          id: 4,
          studentId: 104,
          fullName: "Phạm Minh Đức",
          status: "absent_permission",
        },
      ]);
      setLoading(false);
    }, 800);
  }, [classId, date]);

  const toggleStatus = (id: number) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.id === id) {
          const order: AttendanceStatus[] = [
            "present",
            "late",
            "absent_permission",
            "absent_nopermission",
          ];
          const currentIndex = order.indexOf(record.status);
          const nextStatus = order[(currentIndex + 1) % order.length];
          return { ...record, status: nextStatus };
        }
        return record;
      }),
    );
  };

  const getStatusDisplay = (status: AttendanceStatus) => {
    const map = {
      present: { label: "Có mặt", color: "bg-green-100 text-green-700" },
      late: { label: "Muộn", color: "bg-yellow-100 text-yellow-700" },
      absent_permission: {
        label: "Vắng có phép",
        color: "bg-blue-100 text-blue-700",
      },
      absent_nopermission: {
        label: "Vắng không phép",
        color: "bg-red-100 text-red-700",
      },
    };
    return map[status] || { label: status, color: "bg-gray-100" };
  };

  if (loading) {
    return (
      <div className="text-center py-12">Đang tải danh sách điểm danh...</div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Điểm danh ngày {date}</h2>
        <button className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
          ✅ Điểm danh tất cả Có mặt
        </button>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-4 text-left">Học sinh</th>
            <th className="px-6 py-4 text-center">Trạng thái</th>
            <th className="px-6 py-4 text-center w-80">Ghi chú</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {records.map((record) => {
            const statusInfo = getStatusDisplay(record.status);
            return (
              <tr
                key={record.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-5 font-medium">{record.fullName}</td>
                <td className="px-6 py-5 text-center">
                  <button
                    onClick={() => toggleStatus(record.id)}
                    className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </button>
                </td>
                <td className="px-6 py-5">
                  <input
                    type="text"
                    placeholder="Nhập ghi chú..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
