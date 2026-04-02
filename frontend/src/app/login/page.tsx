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
    } catch {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">🎓 QuanLyHS</h1>
        <p className="text-center text-gray-500 mb-6">Hệ thống Quản lý Học sinh</p>
        {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="admin" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="••••••••" />
        </div>
        <button onClick={handleLogin} disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </div>
    </div>
  );
}