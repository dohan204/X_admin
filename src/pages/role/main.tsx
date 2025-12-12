import { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Card,
    Typography,
    CardContent,
    CardActions,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    Skeleton,
    TableRow,
    TableCell,
    ButtonGroup,
    IconButton,
    TablePagination
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { type RoleView, type PropsOpenAdd } from './genericModel';
import axios from 'axios';
import AddToUser from './withUser/AddRoleForUser';
import UpdateRoleForUser from './withUser/UpdateRoleForUser';
import { Outlet, useLocation } from 'react-router-dom';
export default function RoleMain() {
    const location = useLocation()
    const [roles, setRoles] = useState<RoleView[]>([])
    const [count, setCount] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [rowPerPage, setRowPerPage] = useState<number>(5)
    const [userId, setUserId] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)

    const startIndex = page * rowPerPage
    const endIndex = startIndex + rowPerPage

    const paginatedData = roles.slice(startIndex, endIndex);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }
    const handleChangeRowPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    const handleOpenAdd = (id: string) => {
        setUserId(id)
        setOpenAdd(true)
    }
    const handleClose = () => setOpenAdd(false)


    const handleOpenEdit = (id: string, userName: string) => {
        setUserId(id)
        setUserName(userName)
        setOpenEdit(true);
    }
    const handleCloseEdit = () => setOpenEdit(false);

    // kiểm tra xem url có phải là /main/manager hay không
    const isManagerRoute = location.pathname.endsWith('/manager')
    debugger
    const fetchDataRole = async () => {
        setLoading(true)
        try {
            const res = await axios.get<RoleView[]>('http://localhost:8089/api/Role/with-users')
            setRoles(res.data)
            console.log('dữ liệu được trả về từ api.', res.data)
        } catch (err) {
            console.error('lỗi không tải được dữ liệu vài trò người dùng: ', err)
        } finally {
            setLoading(false)
        }
    }
    // refresh page
    const refreshData = () => {
        fetchDataRole();
    }
    const getCountRole = async () => {
        setLoading(true)
        try {
            const res = await axios.get('http://localhost:8089/api/Role/CountRole')
            setCount(res.data)
        } catch (err) {
            console.error("lỗi không có lấy được tổng các vai trò.", err)
        } finally {
            setLoading(true);
        }
    }
    useEffect(() => {
        fetchDataRole()
        getCountRole()
    }, [])


    return (
        <Box component={Paper} flexGrow={1} sx={{
            minHeight: '70vh',           // full màn hình
            display: 'flex',
            alignItems: 'center',         // căn giữa dọc
            justifyContent: 'center',     // căn giữa ngang
            bgcolor: 'grey.100',
            p: 1,                         // padding = theme.spacing(3)
        }}>
            {!isManagerRoute && (
                <div >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '97%', height: 240, borderRadius: 2, margin: 2 }} >
                        <Card sx={{
                            width: '31%',
                            height: '95%',
                            p: 1,
                            m: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignContent: 'center',
                            justifyContent: 'center',
                            // textAlign: 'center'
                        }}>
                            <CardContent>
                                <Typography variant='h4' component='div' sx={{ color: 'lightgreen' }}>
                                    Tổng số vai trò hiện có: {count}
                                </Typography>
                                <Typography sx={{ color: 'lightseagreen' }}>
                                    Bấm vào nút ở dưới để xem thêm
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size='small' variant='outlined' color='info'>
                                    Xem thêm.
                                </Button>
                            </CardActions>
                        </Card>
                        <Card sx={{
                            width: '31%',
                            height: '95%',
                            p: 1,
                            m: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignContent: 'center',
                        }}>
                            <CardContent>
                                <Typography variant='h4' component='div' color='error'>
                                    Số người dùng có vai trò: 5
                                </Typography>
                                <Typography sx={{ color: 'lightsalmon' }}>
                                    Để xem chi tiết nhấn vào nút đăng ký.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size='small' color='secondary' variant='outlined'>
                                    Xem thêm
                                </Button>
                            </CardActions>
                        </Card>
                        <Card sx={{
                            width: '31%',
                            height: '95%',
                            p: 1,
                            m: 1,
                        }}>
                            <CardContent>
                                <Typography variant='h4' borderColor='lightseagreen' color='warning'>
                                    Vai trò đang hoạt động: 5
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                    Dưới đây là thông tin chi tiết hơn
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant='outlined' color='success'>
                                    Xem thêm
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        width: '96%',
                        height: 'auto',
                        m: 3,
                    }} >
                        <Card
                            sx={{
                                width: '100%',
                                height: 'auto',
                                // overflow: 'auto'
                            }}
                        >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell>Tài khoản</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Vai trò</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell align='right'>Xử lý</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            // HIỆN 5 DÒNG SKELETON KHI ĐANG LOAD
                                            [...Array(rowPerPage)].map((_, index) => (
                                                <TableRow key={index}>
                                                    <TableCell><Skeleton width="80%" /></TableCell>
                                                    <TableCell><Skeleton width="70%" /></TableCell>
                                                    <TableCell><Skeleton width="90%" /></TableCell>
                                                    <TableCell><Skeleton width="60%" /></TableCell>
                                                    <TableCell><Skeleton width="50%" /></TableCell>
                                                    <TableCell align="right">
                                                        <Skeleton variant="circular" width={32} height={32} sx={{ display: 'inline-block', mx: 0.5 }} />
                                                        <Skeleton variant="circular" width={32} height={32} sx={{ display: 'inline-block', mx: 0.5 }} />
                                                        <Skeleton variant="circular" width={32} height={32} sx={{ display: 'inline-block', mx: 0.5 }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : paginatedData.length === 0 ? (
                                            // KHÔNG CÓ DỮ LIỆU
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    <Typography variant="body2" color="text.secondary">
                                                        Không có dữ liệu
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            // DỮ LIỆU THẬT
                                            paginatedData.map((role, index) => (
                                                <TableRow key={role.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{role.userName}</TableCell>
                                                    <TableCell>{role.email}</TableCell>
                                                    <TableCell>{role.roleName.join(', ')}</TableCell>
                                                    <TableCell>{role.isActive ? 'Hoạt động' : 'Vô hiệu'}</TableCell>
                                                    <TableCell align="right">
                                                        <ButtonGroup size="small">
                                                            <IconButton onClick={() => handleOpenAdd(role.id)}>
                                                                <AutoAwesomeIcon color='primary' />
                                                            </IconButton>
                                                            <IconButton>
                                                                <ClearIcon color='secondary' />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleOpenEdit(role.id, role.userName)}>
                                                                <EditNoteIcon color='error' />
                                                            </IconButton>
                                                        </ButtonGroup>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component={'div'}
                                    count={roles.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowPerPage}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
                                    onRowsPerPageChange={handleChangeRowPerPage}
                                />
                            </TableContainer>
                        </Card>
                        <AddToUser open={openAdd} userId={userId} handleCloseAdd={handleClose} onSuccess={refreshData} />
                        <UpdateRoleForUser open={openEdit} handleClose={handleCloseEdit} userId={userId} userName={userName} onSuccess={refreshData} />
                    </Box>
                </div>
            )}
            <Outlet />
        </Box>
    )
}