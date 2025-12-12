import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Autocomplete,
  Box,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { type PropsOpenAdd, type RoleViewModel, type AddRoleToUser } from "../genericModel";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

export default function AddToUser(props: PropsOpenAdd) {
    debugger
  const { open, handleCloseAdd, userId, onSuccess } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleViewModel[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<AddRoleToUser>({
    defaultValues: {
      userID: userId || '',
      roleName: ''
    }
  });

  // Lấy danh sách roles
  useEffect(() => {
    const getAllRole = async () => {
      setLoading(true);
      try {
        debugger
        const res = await axios.get<RoleViewModel[]>('http://localhost:8089/api/Role');
        setRoles(res.data);
        console.log(res.data)
      } catch (err) {
        console.error('Lỗi lấy danh sách role:', err);
      } finally {
        setLoading(false);
      }
    };
    getAllRole();
  }, []);

  // Cập nhật form khi userId thay đổi
  useEffect(() => {
    if (userId) {
      reset({ userID: userId, roleName: '' });
    }
  }, [userId, reset]);

  // Xử lý submit: gửi name + userId lên backend
  const onSubmit: SubmitHandler<AddRoleToUser> = async (data: AddRoleToUser) => {
    if (!data.roleName) {
      alert("Vui lòng chọn vai trò!");
      return;
    }
    debugger
    try {
      setLoading(true);
      const payload = {
        userId: data.userID,
        roleName: data.roleName
      };

      console.log("Gửi dữ liệu:", payload);

      // GỌI API THÊM ROLE CHO USER
      await axios.post('http://localhost:8089/api/Role/assign', payload);

      alert("Thêm vai trò thành công!");
      handleCloseAdd(); // Đóng dialog
      onSuccess();
      reset(); // Reset form
      
    } catch (err: any) {
      console.error("Lỗi thêm role:", err);
      alert(err.response?.data?.message || "Thêm vai trò thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm vai trò cho người dùng</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* User ID - chỉ đọc */}
            <Controller
              name="userID"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="User ID"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  slotProps={{
                    input: { readOnly: true }
                  }}
                  disabled
                />
              )}
            />

            {/* Chọn Role */}
            <Controller
              name="roleName"
              control={control}
              rules={{ required: "Vui lòng chọn vai trò" }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={roles}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.name === value?.name}
                  value={roles.find(r => r.name === value) || null}
                  onChange={(_, newValue) => {
                    onChange(newValue?.name || '');
                  }}
                  loading={loading}
                  renderOption={(props, options) => (
                    <li {...props} key={options.id || options.name}>
                        {options.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vai trò"
                      variant="outlined"
                      margin="normal"
                      error={!!errors.roleName}
                      helperText={errors.roleName?.message}
                      
                    />
                  )}
                />
              )}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseAdd}>Hủy</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Đang thêm..." : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}