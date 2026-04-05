"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { classApi, Class } from "@/services/classApi";
import ClassModal from "@/components/ClassModal";

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [modalTitle, setModalTitle] = useState("");

  // Kiểm tra token và lấy dữ liệu
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchClasses();
  }, [router]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classApi.getAll();
      setClasses(data);
    } catch (error) {
      console.error("Lỗi tải danh sách lớp:", error);
      if (error?.response?.status === 401) {
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.replace("/login");
  };

  // Mở modal thêm mới
  const handleAdd = () => {
    setEditingClass(null);
    setModalTitle("Thêm lớp học mới");
    setIsModalOpen(true);
  };

  // Mở modal sửa
  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setModalTitle("Sửa thông tin lớp");
    setIsModalOpen(true);
  };

  // Lưu (thêm mới hoặc cập nhật)
  const handleSave = async (data: Partial<Class>) => {
    try {
      if (editingClass) {
        // Cập nhật
        await classApi.update(editingClass.id, data);
        alert("Cập nhật lớp học thành công!");
      } else {
        // Thêm mới
        await classApi.create(data);
        alert("Thêm lớp học thành công!");
      }
      setIsModalOpen(false);
      fetchClasses(); // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi lưu lớp học:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // Xóa lớp
  const handleDelete = async (id: number, className: string) => {
    const confirm = window.confirm(`Bạn có chắc chắn muốn xóa lớp "${className}"?`);
    if (!confirm) return;

    try {
      await classApi.delete(id);
      alert("Xóa lớp học thành công!");
      fetchClasses(); // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi xóa lớp:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📚 QuanLyHS</h1>
        <div className="flex gap-4 items-center">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/classes" className="hover:underline font-bold">Lớp học</a>
          <a href="/students" className="hover:underline">Học sinh</a>
          <a href="/subjects" className="hover:underline">Môn học</a>
          <a href="/scores" className="hover:underline">Điểm số</a>
          <a href="/attendance" className="hover:underline">Điểm danh</a>
          <a href="/reports" className="hover:underline">Báo cáo</a>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Đăng xuất
          </button>
        </div>
      </nav>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Danh sách Lớp học</h2>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <span>+</span> Thêm lớp mới
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">STT</th>
                  <th className="p-3">Tên lớp</th>
                  <th className="p-3">Khối</th>
                  <th className="p-3">Năm học</th>
                  <th className="p-3">GV Chủ nhiệm</th>
                  <th className="p-3">Số HS</th>
                  <th className="p-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {classes.length > 0 ? (
                  classes.map((cls, i) => (
                    <tr key={cls.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3 font-medium">{cls.name}</td>
                      <td className="p-3">{cls.grade}</td>
                      <td className="p-3">{cls.academicYear}</td>
                      <td className="p-3">{cls.homeroomTeacher || "Chưa có"}</td>
                      <td className="p-3">{cls.students?.length || 0}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(cls)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(cls.id, cls.name)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-3 text-center text-gray-500">
                      Chưa có dữ liệu. Hãy thêm lớp học mới!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingClass}
        title={modalTitle}
      />
    </div>
  );
}