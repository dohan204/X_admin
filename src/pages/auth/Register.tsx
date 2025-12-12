  import axios from "axios";
  import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
  // import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import  { useEffect, useState } from "react";
  import dayjs, { Dayjs } from "dayjs";
  // import {RHFInput} from 'react-hook-form-input'
  import { Grid, Box, TextField, Alert, Autocomplete, Button } from "@mui/material";
  import { Controller, useForm, type SubmitHandler } from "react-hook-form";
  import { useNavigate } from "react-router-dom";
// import { Fullscreen } from "@mui/icons-material";

  interface RegisterUser {
    username: string;
    fullname: string;
    password: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Dayjs | null;
    provinceId: number | null;
    wardscommuneId: number | null;
  }

  interface Province {
    id: number;
    name: string;
    code: string;
    wardsDto: WardsCommune[]; // Đúng tên trường
  }

  interface WardsCommune {
    id: number;
    name: string;
    provinceId: number;
  }

  export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<WardsCommune[]>([]);
    console.log(provinces)
    const {
      control,
      handleSubmit,
      watch,
      setValue
    } = useForm<RegisterUser>({
      defaultValues: {
        username: '',
        fullname: '',
        password: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: null,
        provinceId: null,
        wardscommuneId: null,
      },
    });

    const selectedProvinceId = watch('provinceId');
    console.log(selectedProvinceId)
    // Lấy danh sách tỉnh
    useEffect(() => {
      const getProvinces = async () => {
        try {
          const res = await axios.get('http://localhost:8089/api/Province/get-AllProvinceWithCommune');
          setProvinces(res.data || []);
        } catch (err) {
          console.error('Lỗi lấy tỉnh:', err);
          setError('Không thể tải danh sách tỉnh.');
        }
      };
      getProvinces();
    }, []);

    // Cập nhật phường/xã khi chọn tỉnh
    useEffect(() => {
      if (selectedProvinceId) {
        const selected = provinces.find(p => p.id === selectedProvinceId);
        console.log(selected)
        setWards(selected?.wardsDto || []);
        setValue('wardscommuneId', null); // Reset phường/xã
      } else {
        setWards([]);
        setValue('wardscommuneId', null);
      }
    }, [selectedProvinceId, provinces, setValue]);

    const postUser: SubmitHandler<RegisterUser> = async (data: RegisterUser) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      console.log('dữ liệu đăng ký, ',data)
      try {
        const formattedDate = data.dateOfBirth ? dayjs(data.dateOfBirth).format('YYYY-MM-DD') : null
        const payload = {
          ...data,
          dateOfBirth: formattedDate
        };
        const res = await axios.post('http://localhost:8089/api/Account/create', payload);
        console.log('Đăng ký thành công:', res.data);
        setSuccess(true);

        const timer = setTimeout(() => {
          navigate('/login');
        }, 1500);

        return () => clearTimeout(timer); // Cleanup
      } catch (err: any) {
        console.error('Lỗi đăng ký:', err);
        setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Đăng ký thành công! Đang chuyển hướng...</Alert>}

          <form onSubmit={handleSubmit(postUser)}>
            <Grid container spacing={3} sx={{display: 'flex', justifyContent: 'center'}}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: 'Tên tài khoản không được để trống.' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Tên tài khoản"
                        variant="standard"
                        error={!!error}
                        fullWidth
                        helperText={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="fullname"
                    control={control}
                    rules={{ required: 'Họ và tên không được để trống.' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Họ và tên"
                        variant="standard"
                        error={!!error}
                        fullWidth
                        helperText={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Mật khẩu không được để trống.',
                      minLength: { value: 8, message: 'Mật khẩu phải ít nhất 8 ký tự.' },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        variant="standard"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email không được để trống.',
                      pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ.' },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Email"
                        variant="standard"
                        error={!!error}
                        fullWidth
                        helperText={error?.message}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: 'Số điện thoại không được để trống.' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Điện thoại"
                        variant="standard"
                        error={!!error}
                        fullWidth
                        helperText={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="dateOfBirth"
                    control={control}
                    rules={{ required: 'Ngày sinh không được để trống.' }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Ngày sinh"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            variant: 'standard',
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="provinceId"
                    control={control}
                    rules={{ required: 'Vui lòng chọn tỉnh/thành phố.' }}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        options={provinces}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        value={provinces.find(p => p.id === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue ? newValue.id : null)}
                        autoHighlight
                        selectOnFocus
                        clearOnBlur={false}
                        handleHomeEndKeys
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tỉnh/Thành phố"
                            variant="standard"
                            error={!!error}
                            fullWidth
                            helperText={error?.message}
                          />
                        )}
                        noOptionsText="Không tìm thấy tỉnh"
                      />
                    )}
                  />

                  <Controller
                    name="wardscommuneId"
                    control={control}
                    rules={{ required: 'Vui lòng chọn phường/xã.' }}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        options={wards}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={wards.find(w => w.id === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue ? newValue.id : null)}
                        disabled={!selectedProvinceId}
                        autoHighlight
                        selectOnFocus
                        clearOnBlur={false}
                        handleHomeEndKeys
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Phường/Xã"
                            variant="standard"
                            fullWidth
                            error={!!error}
                            helperText={error?.message || (!selectedProvinceId ? 'Chọn tỉnh trước' : '')}
                          />
                        )}
                        noOptionsText="Không có phường/xã"
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                fullWidth={false}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>
            </Box>
          </form>
      </LocalizationProvider>
    );
  }