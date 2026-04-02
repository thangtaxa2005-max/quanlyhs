"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function ReportsPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportType, setReportType] = useState("attendance");
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    Promise.all([api.get("/classes"), api.get("/subjects")])
      .then(([c, s]) => { setClasses(c.data); setSubjects(s.data); })
      .catch(() => router.replace("/login"));
  }, [router]);

  const handleGenerateReport = async () => {
    if (!selectedClass) { alert("Vui lòng chọn lớp!"); return; }
    setLoading(true);
    setReportData([]);
    try {
      if (reportType === "attendance") {
        const res = await api.get(`/attendance/class/${selectedClass}/date/${selectedDate}`);
        setReportData(res.data);
      } else if (reportType === "scores") {
        if (!selectedSubject) { alert("Vui lòng chọn môn học!"); setLoading(false); return; }
        const res = await api.get(`/scores/dtbm?classId=${selectedClass}&subjectId=${selectedSubject}&semesterId=1`);
        setReportData(res.data);
      } else if (reportType === "summary") {
        const [students, attendance] = await Promise.all([
          api.get(`/students?classId=${selectedClass}`),
          api.get(`/attendance/class/${selectedClass}/date/${selectedDate}`),
        ]);
        const attendanceMap: any = {};
        attendance.data.forEach((a: any) => { attendanceMap[a.student.id] = a.status; });
        const summary = students.data.map((s: any) => ({
          student: s,
          status: attendanceMap[s.id] || "Chưa điểm danh",
        }));
        setReportData(summary);
      }
    } catch (err) {
      alert("Có lỗi khi tải báo cáo!");
    } finally {
      setLoading(false);
    }
  };

  const getXepLoai = (dtbm: number) => {
    if (dtbm >= 8.0) return { label: "Giỏi", color: "text-green-600" };
    if (dtbm >= 6.5) return { label: "Khá", color: "text-blue-600" };
    if (dtbm >= 5.0) return { label: "Trung bình", color: "text-yellow-600" };
    return { label: "Yếu", color: "text-red-600" };
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center print:hidden">
        <h1 className="text-xl font-bold">🎓 QuanLyHS</h1>
        <div className="flex gap-4 items-center">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/classes" className="hover:underline">Lớp học</a>
          <a href="/students" className="hover:underline">Học sinh</a>
          <a href="/subjects" className="hover:underline">Môn học</a>
          <a href="/scores" className="hover:underline">Điểm số</a>
          <a href="/attendance" className="hover:underline">Điểm danh</a>
          <a href="/reports" className="hover:underline font-bold">Báo cáo</a>
          <button onClick={() => { localStorage.removeItem("access_token"); router.replace("/login"); }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Đăng xuất</button>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Báo cáo & Thống kê</h2>

        {/* Bộ lọc */}
        <div className="bg-white p-6 rounded-lg shadow mb-6 print:hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2">
                <option value="attendance">Chuyên cần theo ngày</option>
                <option value="summary">Tổng hợp lớp học</option>
                <option value="scores">Bảng điểm môn học</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lớp học</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2">
                <option value="">-- Chọn lớp --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.class_name || c.name}</option>
                ))}
              </select>
            </div>
            {reportType === "scores" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2">
                  <option value="">-- Chọn môn --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.subject_name || s.name}</option>
                  ))}
                </select>
              </div>
            )}
            {(reportType === "attendance" || reportType === "summary") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2" />
              </div>
            )}
            <div className="flex items-end">
              <button onClick={handleGenerateReport} disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Đang tải..." : "Xem báo cáo"}
              </button>
            </div>
          </div>
        </div>

        {/* Kết quả báo cáo */}
        {reportData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4 print:hidden">
              <h3 className="text-lg font-bold text-gray-800">
                {reportType === "attendance" && "📋 Báo cáo Chuyên cần"}
                {reportType === "summary" && "📋 Tổng hợp Lớp học"}
                {reportType === "scores" && "📋 Bảng điểm Môn học"}
              </h3>
              <button onClick={handlePrint}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                🖨️ In báo cáo
              </button>
            </div>

            {/* Báo cáo chuyên cần */}
            {reportType === "attendance" && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3">STT</th>
                    <th className="p-3">Học sinh</th>
                    <th className="p-3">Trạng thái</th>
                    <th className="p-3">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3 font-medium">{item.student?.full_name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          item.status === "present" ? "bg-green-100 text-green-700" :
                          item.status === "absent" ? "bg-red-100 text-red-700" :
                          item.status === "late" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"}`}>
                          {item.status === "present" ? "Có mặt" :
                           item.status === "absent" ? "Vắng" :
                           item.status === "late" ? "Đi muộn" : "Có phép"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">{item.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Tổng hợp lớp học */}
            {reportType === "summary" && (
              <>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {["Có mặt", "Vắng", "Đi muộn", "Có phép"].map((label, i) => {
                    const statuses = ["present", "absent", "late", "excused"];
                    const count = reportData.filter((d) => d.status === statuses[i]).length;
                    const colors = ["bg-green-100 text-green-700", "bg-red-100 text-red-700",
                                   "bg-yellow-100 text-yellow-700", "bg-blue-100 text-blue-700"];
                    return (
                      <div key={i} className={`p-4 rounded-lg text-center ${colors[i]}`}>
                        <p className="text-3xl font-bold">{count}</p>
                        <p className="text-sm mt-1">{label}</p>
                      </div>
                    );
                  })}
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-3">STT</th>
                      <th className="p-3">Học sinh</th>
                      <th className="p-3">Trạng thái hôm nay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3 font-medium">{item.student?.full_name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            item.status === "present" ? "bg-green-100 text-green-700" :
                            item.status === "absent" ? "bg-red-100 text-red-700" :
                            item.status === "late" ? "bg-yellow-100 text-yellow-700" :
                            item.status === "Chưa điểm danh" ? "bg-gray-100 text-gray-600" :
                            "bg-blue-100 text-blue-700"}`}>
                            {item.status === "present" ? "Có mặt" :
                             item.status === "absent" ? "Vắng" :
                             item.status === "late" ? "Đi muộn" :
                             item.status === "excused" ? "Có phép" : "Chưa điểm danh"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Bảng điểm */}
            {reportType === "scores" && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3">STT</th>
                    <th className="p-3">Học sinh</th>
                    <th className="p-3">ĐTBm</th>
                    <th className="p-3">Xếp loại</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, i) => {
                    const xepLoai = getXepLoai(item.dtbm);
                    return (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3 font-medium">{item.student?.full_name}</td>
                        <td className="p-3 font-bold text-blue-600">{item.dtbm}</td>
                        <td className={`p-3 font-semibold ${xepLoai.color}`}>{xepLoai.label}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t-2">
                    <td colSpan={2} className="p-3 font-bold">Thống kê</td>
                    <td className="p-3 font-bold text-blue-600">
                      TB: {reportData.length > 0 ?
                        (reportData.reduce((sum, d) => sum + Number(d.dtbm), 0) / reportData.length).toFixed(2) : 0}
                    </td>
                    <td className="p-3">
                      <span className="text-green-600 font-medium">
                        Giỏi: {reportData.filter((d) => d.dtbm >= 8).length}
                      </span>
                      {" | "}
                      <span className="text-yellow-600 font-medium">
                        TB: {reportData.filter((d) => d.dtbm >= 5 && d.dtbm < 6.5).length}
                      </span>
                      {" | "}
                      <span className="text-red-600 font-medium">
                        Yếu: {reportData.filter((d) => d.dtbm < 5).length}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        )}

        {reportData.length === 0 && !loading && (
          <div className="bg-white p-12 rounded-lg shadow text-center text-gray-500">
            <p className="text-4xl mb-4">📊</p>
            <p>Chọn loại báo cáo và nhấn "Xem báo cáo" để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
}