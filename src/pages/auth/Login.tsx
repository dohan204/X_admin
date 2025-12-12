import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { 
  Button, 
  IconButton, 
  InputAdornment, 
  Input, 
  FormControl, 
  InputLabel,
  CircularProgress,
  Alert,
  Typography,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from './auth.module.css'
interface LoginForm {
  username: string;
  password: string;
}

// interface LoginResponse {
//   token: string;
// }

function Login() {
  const [checked, setChecked] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8089/api/Account/login',
        data: {
          username: data.username,
          password: data.password
        },
      })
      const result = response.data;
      setSuccess(true)
      console.log("✅ Login success:", result);
      
      localStorage.setItem('token', result.token);

      // lưu lại thông tin đăng nhập khi api trả về
      localStorage.setItem('user', JSON.stringify(result))

      if(checked){
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error("❌ Login error:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Tên đăng nhập hoặc mật khẩu không đúng!");
        } else if (error.response?.status === 500) {
          setError("Lỗi server, vui lòng thử lại sau!");
        } else {
          setError("Đăng nhập thất bại, vui lòng thử lại!");
        }
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form_Login}>
      <Typography component={'h2'} variant="h2">
        Đăng nhập
      </Typography>
      {success && <Alert severity="success">Đăng nhập thành công.</Alert>}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Controller
        name="username"
        control={control}
        rules={{ required: "Username là bắt buộc" }}
        render={({ field }) => (
          <TextField 
            {...field}
            id='username-with-textfied'
            label='Username'
            sx={{
              width: 250
            }}
            variant="standard"
          />
        )}
      />

      <Controller 
        name='password'
        control={control}
        rules={{ required: 'Password là bắt buộc' }}
        render={({ field }) => (
          <FormControl sx={{ m: 2 }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              {...field}
              id="standard-adornment-password"
              sx={{
                width: 250
              }}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "hide the password" : "display the password"}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              disabled={loading}
            />
          </FormControl>
        )}
      />
      <FormControlLabel
        label='Lưu đăng nhập'
        control={
          <Checkbox
            checked={checked}
            onChange={handleChecked}
          />
        }
      />
      <Button
        id="submit"
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
        sx={{ py: 1.5, mt: 2 }}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
      </Button>

      <Link to="/register" style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
        Chưa có tài khoản? Đăng ký
      </Link>
    </form>
  );
}

export default Login;