
import axios from "axios";
import { useEffect, useState } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import {
  Paper,
  TableContainer,
  Table,
  Alert,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Backdrop,
  CircularProgress,
  Button,
  Stack,
  Box
} from "@mui/material";
import AddUser from "./accountDialog/addUser";
import EditUser from "./accountDialog/editUser";
import Del from "./accountDialog/delete";

interface UserResponse {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string; // backend trả string ISO
  provinceName: string;
  wardsCommunename: string;
  lastLogin: string;
  createdAt: string;
  provinceId: number;
}

const cellStyle = {
  maxWidth: 160,
  whiteSpace: "normal" as const,
  wordWrap: "break-word" as const,
  fontSize: "0.875rem",
};
export interface Props {
  open: boolean
  handleOpen: () => void
  onSuccess: () => void
  handleClose: () => void
}
export interface EditProps {
  userId: string | null,
  open: boolean,
  onOpenEdit: () => void,
  onCloseEdit: () => void,
}
export interface Remove {
  userId: string
  open: boolean
  triggerRefress: () => void
  openDialog: () => void
  closeDialog: () => void
}
export default function AccountMain() {
  const [account, setAccount] = useState<UserResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDel, setOpenDel] = useState<boolean>(false);
  const [editUserId, setEditUserId] = useState<string>('')
  const [refresh, setRefresh] = useState<boolean>(false)



  const handleEdit = (id: string) => {
    setEditUserId(id);
    setOpenEdit(true)
  }
  const handleCloseEdit = () => {
    setEditUserId('');
    setOpenEdit(false)
  };
  const openDialog = (id: string) => {
    setEditUserId(id)
    setOpenDel(true)
  }
  const handleCloseDel = () => setOpenDel(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const getAllUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8089/api/Account");
      setAccount(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Xảy ra lỗi khi lấy dữ liệu người dùng");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllUser();
  }, [refresh])
  // 👉 Nếu đang loading
  if (loading) {
    return (
      <Backdrop
        open={true}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // 👉 Nếu lỗi
  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  // 👉 Nếu không có dữ liệu
  if (account.length === 0) {
    return <Alert severity="info">Không có dữ liệu người dùng</Alert>;
  }

  // 👉 Nếu có dữ liệu
  return (
    <>
      <Box
        component={Paper} flexGrow={1} 
        sx={{
          minHeight: '100vh',
          maxWidth:'98vw',           // full màn hình
          display: 'flex',
          alignItems: 'center',         // căn giữa dọc
          justifyContent: 'center',
          flexDirection: 'column',     // căn giữa ngang
          bgcolor: 'grey.100',
          p: 3, }}
      >
        <Box display={'flex'} justifyContent={'flex-start'} width={'100%'}>
          <Button
          variant="contained"
          color='secondary'
          onClick={handleOpen}>
          Create a new User
        </Button>
        </Box>
        <AddUser onSuccess={() => setRefresh(refresh => !refresh)} handleClose={handleClose} handleOpen={handleOpen} open={open} />
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            width: 'auto'
          }}
        >
          <Table stickyHeader aria-label="User data table">
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "#333", fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Tài khoản
                </TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Họ và tên
                </TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Email
                </TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Số điện thoại
                </TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Ngày sinh
                </TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Tỉnh/TP
                </TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Phường/Xã
                </TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Đăng nhập cuối
                </TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Ngày tạo
                </TableCell>
                <TableCell sx={{ color: "#333", fontWeight: 600 }} align="left">
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {account.map((data, index) => (
                <TableRow
                  key={data.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                    "&:hover": { backgroundColor: "#e3f2fd" },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="left" sx={cellStyle}>
                    {data.userName}
                  </TableCell>
                  <TableCell align="left" sx={cellStyle}>
                    {data.fullName}
                  </TableCell>
                  <TableCell align="left" sx={cellStyle}>
                    {data.email}
                  </TableCell>
                  <TableCell align="left">{data.phoneNumber}</TableCell>
                  <TableCell align="left">
                    {new Date(data.dateOfBirth).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell align="left" sx={cellStyle}>
                    {data.provinceName}
                  </TableCell>
                  <TableCell align="left" sx={cellStyle}>
                    {data.wardsCommunename}
                  </TableCell>
                  <TableCell align="left">
                    {new Date(data.lastLogin).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell align="left">
                    {new Date(data.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell align='left'>
                    <Stack spacing={2}>
                      <Button variant='contained' startIcon={<DeleteOutlineIcon />} onClick={() =>
                        handleEdit(data.id)}>
                      </Button>
                      <Button variant="outlined" startIcon={<EditRoadIcon />} onClick={() => openDialog(data.id)} ></Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box >
    { openEdit && (
      <EditUser
        userId={editUserId}
        open={openEdit}
        onOpenEdit={() => setOpenEdit(true)}
        onCloseEdit={handleCloseEdit}
      />
    )
}
{
  openDel && <Del
    userId={editUserId}
    open={openDel}
    triggerRefress={() => setRefresh(refresh => !refresh)}
    openDialog={() => setOpenDel(true)}
    closeDialog={handleCloseDel} />
}
    </>
  );
}
