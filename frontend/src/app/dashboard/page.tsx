"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ classes: 0, students: 0, subjects: 0 });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    Promise.all([
      api.get("/classes"),
      api.get("/students"),
      api.get("/subjects"),
    ]).then(([c, s, sub]) => {
      setStats({
        classes: c.data.length,
        students: s.data.length,
        subjects: sub.data.length,
      });
    }).catch(() => router.replace("/login"));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎓 QuanLyHS</h1>
        <div className="flex gap-4 items-center">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/classes" className="hover:underline">Lớp học</a>
          <a href="/students" className="hover:underline">Học sinh</a>
          <a href="/subjects" className="hover:underline">Môn học</a>
          <a href="/scores" className="hover:underline">Điểm số</a>
          <a href="/attendance" className="hover:underline">Điểm danh</a>
          <a href="/reports" className="hover:underline">Báo cáo</a>
          <button onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Đăng xuất</button>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan hệ thống</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-4xl font-bold text-blue-600">{stats.classes}</p>
            <p className="text-gray-600 mt-2">Lớp học</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-4xl font-bold text-green-600">{stats.students}</p>
            <p className="text-gray-600 mt-2">Học sinh</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-4xl font-bold text-purple-600">{stats.subjects}</p>
            <p className="text-gray-600 mt-2">Môn học</p>
          </div>
        </div>
      </div>
    </div>
  );
}