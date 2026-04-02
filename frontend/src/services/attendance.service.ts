import api from '@/lib/axios';

export const attendanceService = {
  // Lấy danh sách điểm danh theo lớp và ngày
  async getAttendanceList(classId: number, date: string) {
    const res = await api.get(`/attendance/class/${classId}/date/${date}`);
    return res.data;
  },

  // Đánh dấu điểm danh cho 1 học sinh
  async markAttendance(data: {
    studentId: number;
    classId: number;
    date: string;
    status: string;
    note?: string;
  }) {
    const res = await api.post('/attendance/mark', data);
    return res.data;
  },
};