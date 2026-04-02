"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    api.get("/students").then((res) => setStudents(res.data)).catch(() => router.replace("/login"));
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎓 QuanLyHS</h1>
        <div className="flex gap-4 items-center">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/classes" className="hover:underline">Lớp học</a>
          <a href="/students" className="hover:underline font-bold">Học sinh</a>
          <a href="/subjects" className="hover:underline">Môn học</a>
          <a href="/scores" className="hover:underline">Điểm số</a>
          <a href="/attendance" className="hover:underline">Điểm danh</a>
          <button onClick={() => { localStorage.removeItem("access_token"); router.replace("/login"); }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Đăng xuất</button>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách Học sinh</h2>
        <table className="w-full bg-white rounded-lg shadow text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">STT</th>
              <th className="p-3">Họ tên</th>
              <th className="p-3">Ngày sinh</th>
              <th className="p-3">Giới tính</th>
              <th className="p-3">SĐT phụ huynh</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{s.full_name || s.fullName}</td>
                <td className="p-3">{s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString("vi-VN") : ""}</td>
                <td className="p-3">{s.gender}</td>
                <td className="p-3">{s.parent_phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}