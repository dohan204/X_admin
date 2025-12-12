import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import type { Props } from "./../mainAccount";
import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

interface User {
  username: string;
  fullname: string;
  password: string;
  email: string;
  phoneNumber: string;
  birthDate: Date | null;
  provinceId: number;
  wardsCommuneId: number;
}

interface Province {
  id: number;
  name: string;
  code: string;
  wardsDto: Wards[];
}

interface Wards {
  id: number;
  name: string;
}

export default function AddUser(props: Props) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [wards, setWards] = useState<Wards[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<User>({
    defaultValues: {
      username: "",
      fullname: "",
      password: "",
      email: "",
      phoneNumber: "",
      birthDate: null,
      provinceId: 0,
      wardsCommuneId: 0,
    },
  });

  const { open, handleClose, onSuccess } = props;

  // Lấy danh sách tỉnh
  useEffect(() => {
    const getProvince = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:8089/api/Province/get-AllProvinceWithCommune"
        );
        console.log("Danh sách tỉnh:", res.data);
        setProvinces(res.data);
      } catch (err) {
        console.error("Không lấy được dữ liệu từ API", err);
        setErrorMessage("Không thể tải danh sách tỉnh.");
      } finally {
        setLoading(false);
      }
    };
    getProvince();
  }, []);

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!open) {
      reset();
      setWards([]);
      setErrorMessage(null);
    }
  }, [open, reset]);

  // XÓA: handleProvinceChange, handleWardChange, selectedProvinceId → DƯ THỪA

  const handleSubmitFormRegister: SubmitHandler<User> = async (data: User) => {
    setLoading(true);
    setErrorMessage(null);

    try {
    const payload = {
      username: data.username,
      fullname: data.fullname,
      password: data.password,
      email: data.email,
      phoneNumber: data.phoneNumber,
      DateOfBirth: data.birthDate ? dayjs(data.birthDate).format("YYYY-MM-DD") : null, // ← ĐÚNG TÊN
      provinceId: data.provinceId,
      wardsCommuneId: data.wardsCommuneId || 0,
    };
      console.log("Payload gửi đi:", payload); // DEBUG: XEM CÓ provinceId: 1 không

      const res = await axios.post(
        "http://localhost:8089/api/Account/create",
        payload
      );
      console.log("Tạo tài khoản thành công:", res.data);
      handleClose();
      reset();
      onSuccess();
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      setErrorMessage(
        error.response?.data?.message || "Tạo tài khoản thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Alert severity="info">Đang tải dữ liệu...</Alert>;
  }

  if (provinces.length === 0) {
    return <Alert severity="error">Không có dữ liệu tỉnh để hiển thị.</Alert>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{p: 1}}>
        {errorMessage && (
          <Alert severity="error" >
            {errorMessage}
          </Alert>
        )}

        <Dialog open={open}>
          <DialogTitle
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              pb: 1,
            }}
          >
            Thêm người dùng
          </DialogTitle>

          <form onSubmit={handleSubmit(handleSubmitFormRegister)}>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Cột trái */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: "Tên tài khoản không được để trống." }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Tài khoản"
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />

                  <Controller
                    name="fullname"
                    control={control}
                    rules={{ required: "Họ và tên không được để trống." }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Họ và tên"
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Mật khẩu không được để trống.",
                      minLength: {
                        value: 8,
                        message: "Mật khẩu phải ít nhất 8 ký tự.",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Mật khẩu"
                        type="password"
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email không được để trống.",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email không hợp lệ.",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />
                </Grid>

                {/* Cột phải */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: "Số điện thoại không được để trống." }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Điện thoại"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />

                  <Controller
                    name="birthDate"
                    control={control}
                    rules={{ required: "Vui lòng chọn ngày sinh." }}
                    render={({ field, fieldState: { error } }) => (
                      <DateTimePicker
                        label="Ngày sinh"
                        value={field.value ? dayjs(field.value) : null}
                        format="DD/MM/YYYY HH:mm"
                        ampm={false}
                        onChange={(val) =>
                          field.onChange(val ? val.toDate() : null)
                        }
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                            sx: { mb: 3 },
                          },
                        }}
                      />
                    )}
                  />

                  {/* TỈNH - ĐÃ SỬA: GỬI 0 THAY NULL */}
                  <Controller
                    name="provinceId"
                    control={control}
                    rules={{ required: "Vui lòng chọn Tỉnh/Thành phố." }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={provinces}
                        getOptionLabel={(option) => option.name}
                        value={provinces.find((p) => p.id === value) || null}
                        onChange={(_, selected) => {
                          const provinceId = selected ? selected.id : 0; // SỬA: 0 thay null
                          onChange(provinceId);
                          setWards(selected?.wardsDto ?? []);
                          setValue("wardsCommuneId", 0); // Reset xã/phường
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tỉnh/Thành phố"
                            variant="outlined"
                            error={!!errors.provinceId}
                            helperText={errors.provinceId?.message}
                            sx={{ mb: 3 }}
                          />
                        )}
                        noOptionsText="Không có dữ liệu tỉnh"
                      />
                    )}
                  />

                  {/* XÃ/PHƯỜNG - ĐÃ SỬA: GỬI 0 THAY NULL */}
                  <Controller
                    name="wardsCommuneId"
                    control={control}
                    rules={{
                      required: wards.length > 0 ? "Vui lòng chọn Xã/Phường." : false,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={wards}
                        getOptionLabel={(option) => option.name}
                        value={wards.find((w) => w.id === value) || null}
                        onChange={(_, selected) => {
                          onChange(selected?.id ?? 0); // SỬA: 0 thay null
                        }}
                        disabled={wards.length === 0}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Xã/Phường"
                            variant="outlined"
                            error={!!errors.wardsCommuneId}
                            helperText={
                              errors.wardsCommuneId?.message ||
                              (wards.length === 0
                                ? "Vui lòng chọn tỉnh trước"
                                : "")
                            }
                            sx={{ mb: 3 }}
                          />
                        )}
                        noOptionsText={
                          wards.length === 0
                            ? "Vui lòng chọn tỉnh trước"
                            : "Không có dữ liệu xã/phường"
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined" sx={{position: 'absolute'}}>Cancel</Button>
            </DialogActions>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1}}>
              <Button
                type="submit"
                variant="contained"
                size="medium"
                disabled={loading}
                sx={{
                  minWidth: 160,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {loading ? "Đang tạo..." : "Tạo"}
              </Button>
            </Box>
          </form>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}