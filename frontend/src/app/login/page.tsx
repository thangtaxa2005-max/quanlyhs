"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("access_token", res.data.access_token);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Không kết nối được với server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-1">🎓 QuanLyHS</h1>
          <p className="text-gray-500">Hệ thống Quản lý Học sinh</p>
        </div>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>
        )}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            placeholder="admin" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            placeholder="••••••••" />
        </div>
        <button onClick={handleLogin} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </div>
    </div>
  );
}