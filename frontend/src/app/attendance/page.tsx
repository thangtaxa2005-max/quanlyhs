"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { attendanceService } from "@/services/attendance.service";
import api from "@/lib/axios";

export default function AttendancePage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    api.get("/classes").then((res) => setClasses(res.data)).catch(() => router.replace("/login"));
  }, [router]);

  useEffect(() => {
    if (!selectedClass || !selectedDate) return;
    setLoading(true);
    api.get(`/students?classId=${selectedClass}`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Lỗi tải học sinh:", err));
    attendanceService.getAttendanceList(Number(selectedClass), selectedDate)
      .then((data) => setAttendanceData(data))
      .catch((err) => console.error("Lỗi tải điểm danh:", err))
      .finally(() => setLoading(false));
  }, [selectedClass, selectedDate]);

  const handleMarkAttendance = async (studentId: number, status: string) => {
    try {
      await attendanceService.markAttendance({
        studentId, classId: Number(selectedClass), date: selectedDate, status,
      });
      setAttendanceData((prev) => {
        const existing = prev.find((a) => a.student.id === studentId);
        if (existing) return prev.map((a) => a.student.id === studentId ? { ...a, status } : a);
        return [...prev, { student: { id: studentId }, status }];
      });
    } catch { alert("Có lỗi xảy ra khi lưu điểm danh!"); }
  };

  const getStatus = (studentId: number) => {
    const record = attendanceData.find((a) => a.student.id === studentId);
    return record ? record.status : null;
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
          <a href="/attendance" className="hover:underline font-bold">Điểm danh</a>
          <button onClick={() => { localStorage.removeItem("access_token"); router.replace("/login"); }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Đăng xuất</button>
        </div>
      </nav>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Điểm danh</h2>
        <div className="flex gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày điểm danh</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-48" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Lớp</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-48">
              <option value="">-- Chọn lớp --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.class_name || cls.name || `Lớp ${cls.id}`}</option>
              ))}
            </select>
          </div>
        </div>
        {loading && <p className="text-center text-gray-500 py-4">Đang tải...</p>}
        {selectedClass && !loading ? (
          <table className="w-full bg-white rounded-lg shadow text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">STT</th>
                <th className="p-3">Tên Học sinh</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map((student, index) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{student.full_name || student.fullName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      getStatus(student.id) === "present" ? "bg-green-100 text-green-700" :
                      getStatus(student.id) === "absent" ? "bg-red-100 text-red-700" :
                      getStatus(student.id) === "late" ? "bg-yellow-100 text-yellow-700" :
                      getStatus(student.id) === "excused" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-500"}`}>
                      {getStatus(student.id) === "present" ? "Có mặt" :
                       getStatus(student.id) === "absent" ? "Vắng" :
                       getStatus(student.id) === "late" ? "Đi muộn" :
                       getStatus(student.id) === "excused" ? "Có phép" : "Chưa điểm danh"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleMarkAttendance(student.id, "present")}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Có mặt</button>
                    <button onClick={() => handleMarkAttendance(student.id, "absent")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Vắng</button>
                    <button onClick={() => handleMarkAttendance(student.id, "late")}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Đi muộn</button>
                    <button onClick={() => handleMarkAttendance(student.id, "excused")}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Có phép</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="p-3 text-center text-gray-500">Không có học sinh nào trong lớp này.</td></tr>
              )}
            </tbody>
          </table>
        ) : !loading && (
          <p className="text-gray-500 text-center py-10">Vui lòng chọn lớp để hiển thị danh sách học sinh.</p>
        )}
      </div>
    </div>
  );
}