import { useCallback, useEffect, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent,
     Typography, Accordion, AccordionSummary, 
     AccordionDetails, FormControlLabel, FormGroup, Checkbox, DialogActions, Button, 
     AccordionActions} from '@mui/material'
import { type ModuleDto, type FunctionDto, type propsDetails, type PermissionDto, type UpdatePermission } from "../genericModel";
import axios from 'axios';
import { ExpandMore } from '@mui/icons-material';
export default function DialogDetailsRolePermission({ open, handleClose, roleId }: propsDetails) {
    const [modules, setModule] = useState<ModuleDto[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    // const [functions, setFunctions] = useState<FunctionDto[]>([])
    const [selectedPermissions, setSelectedPermission] = useState<Record<number, PermissionDto>>({})

    const fetchData = useCallback(() => {
    if (!roleId) return;

    const getData = async () => {
        setLoading(true);
        try {
            // 1. Lấy Module + Function
            const moduleRes = await axios.get<ModuleDto[]>('http://localhost:8089/api/ModuleFunction/GetModuleFunction');
            setModule(moduleRes.data);

            // 2. Lấy quyền hiện tại của Role
            const permRes = await axios.get<UpdatePermission[]>(
                `http://localhost:8089/api/role/GetPermissionsByRole/${roleId}`
            );

            // Chuyển danh sách thành object: { functionId: PermissionDto }
            const permMap: Record<number, PermissionDto> = {};
            permRes.data.forEach(p => {
                permMap[p.FunctionId] = {
                    canRead: p.CanRead,
                    canCreate: p.CanCreate,
                    canUpdate: p.CanWrite,
                    canDelete: p.CanDelete
                };
            });
            setSelectedPermission(permMap);

        } catch (err) {
            console.error('Lỗi tải dữ liệu:', err);
        } finally {
            setLoading(false);
        }
    };

    getData();
}, [roleId]);
    useEffect(() => {
        if (roleId && open)
            fetchData()
    }, [open, roleId, fetchData])

    const handlePermissionChange = (functionId: number, type: keyof PermissionDto, isCheck: boolean) => {
        setSelectedPermission(prev => {
            const currentFunctionPermissions = prev[functionId] || {canRead: false, canCreate: false, canDelete: false, canUpdate: false}
            return {
                ...prev,
                [functionId]: {
                    ...currentFunctionPermissions,
                    [type]: isCheck
                }
            }
        })
    }

    const isChecked = (functionId: number, type: keyof PermissionDto) => {
        const perms = selectedPermissions[functionId];
        return perms ? perms[type] : false;
    }
    const handleSaveChanges = async () => {
    const payload = Object.entries(selectedPermissions).map(([functionId, perm]) => ({
        FunctionId: parseInt(functionId),
        Name: "", // Có thể lấy từ module.functions nếu cần
        CanCreate: perm.canCreate,
        CanRead: perm.canRead,
        CanWrite: perm.canUpdate,
        CanDelete: perm.canDelete
    }));

    try {
        await axios.post(
            `http://localhost:8089/api/role/update-permission/${roleId}`,
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );

        alert("Cập nhật quyền thành công!");
        handleClose();
    } catch (err: any) {
        console.error("Lỗi lưu quyền:", err);
        alert("Lỗi: " + (err.response?.data?.errors?.[0]?.description || "Không thể lưu"));
    }
};
    return (
        <Box>
            <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
                <DialogTitle>
                    <Typography variant='h4' component='h4'>
                        Chi tiet cho vai tro: {roleId}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                     {modules.map(module => (
                        <Accordion key={module.id}>
                            <AccordionSummary expandIcon={<ExpandMore />}>{module.name}</AccordionSummary>
                            <AccordionDetails>
                                {module.functions.map(func => (
                                    <Box key={func.id}>
                                        <Typography>{func.name}</Typography>
                                        <FormControlLabel 
                                            control={<Checkbox 
                                                checked={isChecked(func.id, 'canRead')} 
                                                onChange={(e) => handlePermissionChange(func.id, 'canRead', e.target.checked)} 
                                            />} 
                                            label="Đọc" 
                                        />
                                        <FormControlLabel 
                                            control={<Checkbox 
                                                checked={isChecked(func.id, 'canCreate')} 
                                                onChange={(e) => handlePermissionChange(func.id, 'canCreate', e.target.checked)} 
                                            />} 
                                            label="Tạo" 
                                        />
                                        <FormControlLabel 
                                            control={<Checkbox 
                                                checked={isChecked(func.id, 'canUpdate')} 
                                                onChange={(e) => handlePermissionChange(func.id, 'canUpdate', e.target.checked)} 
                                            />} 
                                            label="Sua" 
                                        />
                                        <FormControlLabel 
                                            control={<Checkbox 
                                                checked={isChecked(func.id, 'canDelete')} 
                                                onChange={(e) => handlePermissionChange(func.id, 'canDelete', e.target.checked)} 
                                            />} 
                                            label="Xoa" 
                                        />
                                        {/* ... Các checkbox khác tương tự ... */}
                                    </Box>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </DialogContent> 
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSaveChanges} variant="contained" color="primary">Lưu thay đổi</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}