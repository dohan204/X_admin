import { useEffect, useState } from "react";
import { Box, 
    Button, 
    Card, 
    CardActions, 
    CardContent, 
    Grid, 
    IconButton, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography } from "@mui/material";
import {  type RoleViewModel } from "./genericModel";
import AddTaskIcon from '@mui/icons-material/AddTask';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import axios from "axios";
import AddRole from "./addRole";
import EditRoleForm from "./editRole";
import AddPermisstionToRole from "./addPermisstionToRole";

export default function Manager() {
    const [roles, setRoles] = useState<RoleViewModel[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    const [openAddPermission, setOpenAddPermission] = useState<boolean>(false);

    const handleOpenAddPermission = () => setOpenAddPermission(true)
    const handleCloseAddPermission = () => setOpenAddPermission(false)
    const handleOpenAddRole = () => setOpenAdd(true);
    const handleCloseAddRole = () => setOpenAdd(false)
    
    const handleOpenEditRole = (id: string) => {
        setSelectedRoleId(id)
        setOpenEdit(true)
    }
    const handleCloseEditRole = () => setOpenEdit(false)
    const getAllRoleViewMedel = async () => {
        setLoading(true)
        try {
            var res = await axios.get('http://localhost:8089/api/Role');
            setRoles(res.data);
        } catch (err) {
            console.error('lỗi lấy danh sách vai trò.', err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllRoleViewMedel()
    },[])
    const loadData = () => {
        getAllRoleViewMedel()
    }
    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                position: 'relative',
                flexDirection: 'column',
                height: 620,
                m: 2
            }}
        >
            <Grid container spacing={2}
                sx={{
                    width: '97%',
                    height: '35%',
                    m: 1,
                    pb: 3
                }}
                columns={12}
            >
                <Grid size={4}
                    sx={{
                        borderRadius: 2,

                    }}
                >
                    <Card
                        sx={{
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <CardContent>
                            <Typography component={'h3'} variant="h3">
                                Thông tin Các vai trò
                            </Typography>
                            
                        </CardContent>
                        <CardActions>
                            <Button >
                                Chi tiết
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid size={4}
                    sx={{ borderRadius: 2 }}
                >
                    <Card
                        sx={{
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <CardContent>
                            <Typography component={'h3'} variant="h3" color="lightseagreen">
                                Thêm các cho vai trò
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" color='error' onClick={handleOpenAddPermission}>
                                Xem chi tiết
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid size={4}
                    sx={{ borderRadius: 2 }}
                >
                    <Card
                        sx={{
                            width: '100%',
                            height: '100%'
                        }}
                        
                    >
                        <CardContent>
                            <Typography component={'h3'} variant="h3">
                                Tạo vai trò mới
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="large" onClick={handleOpenAddRole} startIcon={<AddTaskIcon />}>
                                Tạo mới
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <Grid container sx={{
                width: '100%',
                height: '55%',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'row',
            }}
                columns={12}
            >
                <Grid component={Paper} size={12}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        mt: 6
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Id</TableCell>
                                    <TableCell align='left'>Tên vai trò</TableCell>
                                    <TableCell align='left'>Trạng thái</TableCell>
                                    <TableCell align='left'>Mô tả</TableCell>
                                    <TableCell align="left">Ngày tạo</TableCell>
                                    <TableCell align='left'>Ngày sửa</TableCell>
                                    <TableCell align='left'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles.map((role, index) => (
                                    <TableRow key={role.id}>
                                        <TableCell align="left">{index + 1}</TableCell>
                                        <TableCell align="left">{role.name}</TableCell>
                                        <TableCell align="left">{role.active ? 'Đang hoạt động' : 'Không hoạt động'}</TableCell>
                                        <TableCell align='left'>{role.description}</TableCell>
                                        <TableCell align='left'>{role.createdAt}</TableCell>
                                        <TableCell align="left">{role.updatedAt}</TableCell>
                                        <TableCell 
                                        >
                                            <IconButton>
                                                <CreateIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenEditRole(role.id)}>
                                                <ClearIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <AddPermisstionToRole 
                openAddPermission={openAddPermission} 
                handleCloseAddPermission={handleCloseAddPermission}
                roles={roles}
            />
            <AddRole openAddRole={openAdd} handleCloseAddRole={handleCloseAddRole} loadData={loadData} /> 
            <EditRoleForm 
                openDelete={openEdit} 
                handleCloseDelete={handleCloseEditRole} 
                loadData={loadData}
                roleId={selectedRoleId}
            />

        </Box>
    )
}