"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function ScoresPage() {
  const router = useRouter();
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    api.get("/scores").then((res) => setScores(res.data)).catch(() => router.replace("/login"));
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎓 QuanLyHS</h1>
        <div className="flex gap-4 items-center">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/classes" className="hover:underline">Lớp học</a>
          <a href="/students" className="hover:underline">Học sinh</a>
          <a href="/subjects" className="hover:underline">Môn học</a>
          <a href="/scores" className="hover:underline font-bold">Điểm số</a>
          <a href="/attendance" className="hover:underline">Điểm danh</a>
          <button onClick={() => { localStorage.removeItem("access_token"); router.replace("/login"); }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Đăng xuất</button>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách Điểm số</h2>
        <table className="w-full bg-white rounded-lg shadow text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">STT</th>
              <th className="p-3">Học sinh</th>
              <th className="p-3">Môn học</th>
              <th className="p-3">Điểm</th>
              <th className="p-3">Loại</th>
            </tr>
          </thead>
          <tbody>
            {scores.length > 0 ? scores.map((s, i) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{s.student?.full_name || s.student?.fullName}</td>
                <td className="p-3">{s.subject?.name || s.subject?.subject_name}</td>
                <td className="p-3 font-bold text-blue-600">{s.score}</td>
                <td className="p-3">{s.score_type || s.type}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-3 text-center text-gray-500">Chưa có dữ liệu điểm số.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}