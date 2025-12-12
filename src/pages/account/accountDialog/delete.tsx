import { useEffect, useState } from "react";
import type { Remove } from "./../mainAccount"; // Giả định Remove interface: { userId: string, open: boolean, openDialog: () => void }
import axios from "axios";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  DialogActions, // Import DialogActions để thêm nút
  Button, // Import Button
} from "@mui/material";

// Giả định kiểu dữ liệu người dùng cơ bản (điều chỉnh nếu cần)
interface UserData {
    fullName: string;
    userName: string;
    // ... thêm các trường khác nếu muốn hiển thị
}

export default function Del(props: Remove) {
  const { userId, open, closeDialog, triggerRefress } = props; // openDialog() dùng để đóng dialog (thường là setState(false) ở component cha)
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------------------
   * 1. Lấy thông tin người dùng (chỉ khi dialog mở và có userId)
   * ------------------------------------------------- */
  useEffect(() => {
    if (!userId || !open) return;
    
    const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
            // Sửa lỗi cú pháp: dùng template literal (``) và async/await
            const res = await axios.get<UserData>(`http://localhost:8089/api/Account/getbyId?id=${userId}`);
            setUser(res.data);
        } catch (err) {
            console.error('Lỗi khi lấy thông tin người dùng:', err);
            setError("Không thể tải thông tin người dùng.");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    fetchUser();
  }, [userId, open]); // Chạy khi userId thay đổi hoặc dialog mở/đóng
  /* -------------------------------------------------
   * 2. Xử lý xóa người dùng
   * ------------------------------------------------- */
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API DELETE
      await axios.delete(`http://localhost:8089/api/Account/deleteAccount?id=${userId}`);
      triggerRefress()
      closeDialog()
      // Xử lý sau khi xóa thành công
      // alert(`Đã xóa người dùng: ${user?.fullName || userId}`); // Thông báo tạm thời // Đóng hộp thoại
      // **TODO:** Thêm logic để làm mới danh sách tài khoản ở component cha
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      setError("Xóa thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box>
      <Dialog open={open} onClose={closeDialog}> {/* Sửa: Truyền prop open và onClose */}
        <DialogTitle>Xóa người dùng</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Typography color="textSecondary">Đang tải...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : user ? (
            <Typography>
              Bạn có chắc chắn muốn xóa người dùng **{user.fullName}** ({user.userName})?
              <br />
              Hành động này không thể hoàn tác.
            </Typography>
          ) : (
            <Typography>Bạn có chắc chắn muốn xóa người dùng này hay không.</Typography>
          )}
        </DialogContent>

        {/* Sửa: Thêm DialogActions cho các nút */}
        <DialogActions>
          <Button onClick={closeDialog} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}