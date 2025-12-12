import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Autocomplete,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { EditProps } from "./../mainAccount";

interface UpdateUser {
  id: string;
  userName: string;
  fullName: string;
  password: string;
  email: string;
  phoneNumber: string;
  birthDate: Dayjs | null;
  provinceId: number | null;
  wardsCommuneId: number | null;
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

export default function EditUser(props: EditProps) {
  const { userId, open, onCloseEdit } = props;

  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Wards[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateUser>({
    defaultValues: {
      userName: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      birthDate: null,
      provinceId: null,
      wardsCommuneId: null,
    },
  });

  /* -------------------------------------------------
   *  1. Lấy danh sách tỉnh (chỉ 1 lần)
   * ------------------------------------------------- */
  useEffect(() => {
    axios
      .get<Province[]>("http://localhost:8089/api/Province/get-AllProvinceWithCommune")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Lỗi tỉnh:", err));
  }, []);

  /* -------------------------------------------------
   *  2. Lấy user + reset form khi provinces đã có
   * ------------------------------------------------- */
  useEffect(() => {
    if (!userId || provinces.length === 0) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get<UpdateUser>(
          `http://localhost:8089/api/Account/getbyId?id=${userId}`
        );
        const u = res.data;

        // Đảm bảo birthDate là Dayjs
        const birth = u.birthDate ? dayjs(u.birthDate) : null;

        reset({
          userName: u.userName ?? "",
          fullName: u.fullName ?? "",
          email: u.email ?? "",
          phoneNumber: u.phoneNumber ?? "",
          birthDate: birth,
          provinceId: u.provinceId ?? 0,
          wardsCommuneId: u.wardsCommuneId ?? 0,
        });

        // Cập nhật danh sách xã/phường tương ứng
        const prov = provinces.find((p) => p.id === u.provinceId);
        setWards(prov?.wardsDto ?? []);
      } catch (err) {
        console.error("Lỗi user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, provinces]);

  /* -------------------------------------------------
   *  3. Submit
   * ------------------------------------------------- */
  const onSubmit: SubmitHandler<UpdateUser> = async (data: UpdateUser) => {
    // data.provinceId / wardsCommuneId đã được chuyển thành 0 nếu null
    console.log("Submit data:", data);
    setLoading(true)
    try {
      // TODO: gọi API PUT/PATCH ở đây
      const payload = {
        ...data, birthDate: data.birthDate ? dayjs(data.birthDate).format('YYYY-MM-DD') : null
      }
      console.log(payload)
      await axios.put(`http://localhost:8089/api/Account/updateAccount?id=${userId}`, payload);
      onCloseEdit();
    } catch (err) {
      console.error('loi,', err)
    } finally {
      setLoading(false)
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onCloseEdit}>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/* CỘT TRÁI */}
                <Grid size={6}>
                  <Controller
                    name="userName"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="userName"
                        variant="standard"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="fullName"
                        variant="standard"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type="password"
                        variant="standard"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Email"
                        variant="standard"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>

                {/* CỘT PHẢI */}
                <Grid size={6}>
                  {/* phoneNumber */}
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: "Số điện thoại không được để trống." }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Điện thoại"
                        variant="standard"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />

                  {/* birthDate */}
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
                        onChange={(val) => field.onChange(val ? val.toDate() : null)}
                        slotProps={{
                          textField: {
                            variant: "standard",
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />

                  {/* TỈNH */}
                  <Controller
                    name="provinceId"
                    control={control}
                    rules={{ required: "Vui lòng chọn Tỉnh/Thành phố." }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={provinces}
                        getOptionLabel={(opt) => opt.name}
                        value={provinces.find((p) => p.id === value) ?? null}
                        onChange={(_, sel) => {
                          const id = sel ? sel.id : 0;
                          onChange(id);
                          setWards(sel?.wardsDto ?? []);
                          setValue("wardsCommuneId", 0);
                        }}
                        isOptionEqualToValue={(opt, val) => opt.id === (val?.id ?? 0)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tỉnh/Thành phố"
                            variant="standard"
                            fullWidth
                            error={!!errors.provinceId}
                            helperText={errors.provinceId?.message}
                          />
                        )}
                        noOptionsText="Không có dữ liệu tỉnh"
                      />
                    )}
                  />

                  {/* XÃ/PHƯỜNG */}
                  <Controller
                    name="wardsCommuneId"
                    control={control}
                    rules={{
                      required: wards.length > 0 ? "Vui lòng chọn Xã/Phường." : false,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={wards}
                        getOptionLabel={(opt) => opt.name}
                        value={wards.find((w) => w.id === value) ?? null}
                        onChange={(_, sel) => onChange(sel?.id ?? 0)}
                        disabled={wards.length === 0}
                        isOptionEqualToValue={(opt, val) => opt.id === (val?.id ?? 0)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Xã/Phường"
                            variant="standard"
                            fullWidth
                            error={!!errors.wardsCommuneId}
                            helperText={
                              errors.wardsCommuneId?.message ||
                              (wards.length === 0 ? "Vui lòng chọn tỉnh trước" : "")
                            }
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
              <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Button type='submit' disabled={loading} variant="outlined" >
                  Lưu
                </Button>
              </Box>
            </form>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onCloseEdit}>Đóng</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}