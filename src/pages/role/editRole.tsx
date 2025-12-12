import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  CircularProgress
} from '@mui/material';
import { type DeleteRoleProps } from './genericModel';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Optional: thông báo đẹp

export default function DeleteRoleDialog({
  roleId,
  openDelete,
  handleCloseDelete,
  loadData
}: DeleteRoleProps) {
  const [loading, setLoading] = useState<boolean>(false);
console.log('roleId: ', roleId)
  const handleDelete = async () => {
    if (!roleId) return;

    setLoading(true);
    try {
      // SỬA: Dùng DELETE thay vì POST
      debugger
      await axios.delete(`http://localhost:8089/api/Role/${roleId}`);

      toast.success('Xóa vai trò thành công!');
      handleCloseDelete();
      loadData(); // Refresh danh sách
    } catch (err: any) {
      console.error('Lỗi xóa vai trò:', err);
      const msg = err.response?.data?.message || 'Không thể xóa vai trò. Có thể đang được sử dụng.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDelete} onClose={handleCloseDelete}>
      <DialogTitle>
        <Typography component="h3" variant="h6" color="error.main">
          Xóa vai trò
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Bạn có <strong>chắc chắn</strong> muốn xóa vai trò này?<br />
          Hành động này <strong>không thể hoàn tác</strong>.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Đang xóa...' : 'Xóa'}
        </Button>

        <Button
          onClick={handleCloseDelete}
          variant="outlined"
          disabled={loading}
        >
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
}