import { Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { type EditRoleForUser, type PropsEditUser, type UpdateRole } from "../genericModel";
import axios from "axios";

export default function UpdateRoleForUser({ open, userId, userName, handleClose, onSuccess }: PropsEditUser) {
    const [roles, setRoles] = useState<UpdateRole[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const { control, handleSubmit, formState: { errors }, reset } = useForm<EditRoleForUser>({
        defaultValues: {
            userId: userId || '',
            userName: userName || '',
            roleName: '',
        }
    })

    const getRoles = async () => {
        setLoading(true)
        try {
            const roles = await axios.get<UpdateRole[]>('http://localhost:8089/api/Role')
            setRoles(roles.data);
        } catch (err) {
            console.error('lỗi không tải được danh sách')
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getRoles();
    }, [])
    useEffect(() => {
        if (userId && userName) {
            reset({
                userId: userId,
                userName: userName,
                roleName: ''
            })
        }
    }, [userId, reset])
    const handleSubmitForm: SubmitHandler<EditRoleForUser> = async (data: EditRoleForUser) => {
        console.log('dữ liệu gửi đi: ', data)
        if(!data.roleName) {
            return <Alert severity="error">Vui lòng chọn vai trò để cập nhật</Alert>
        }
        setLoading(true)
        try {
            await axios.put('http://localhost:8089/api/Role/change', data)
            handleClose()
            reset()
            onSuccess()
        } catch (err) {
            console.error('lỗi, không sửa được vai trò của người dùng.')
        } finally {
            setLoading(false)
        }

    }
    return (
        <Box>
            <Dialog open={open} onClose={handleClose} 
             >
                <DialogTitle>
                    Cập nhật vai trò cho người dùng
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(handleSubmitForm)}>
                        <Controller
                            name="userId"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            readOnly: true
                                        }
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name='userName'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            readOnly: true
                                        }
                                    }}

                                />
                            )}
                        />
                        <Controller
                            name='roleName'
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                    options={roles}
                                    getOptionLabel={option => option.name}
                                    value={roles.find(r => r.name === value)}
                                    onChange={(_, newValue) => {
                                        onChange(newValue?.name || '')
                                    }}
                                    isOptionEqualToValue={(option, value) => option.name === value?.name}
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
                    <Button
                        onClick={handleSubmit(handleSubmitForm)}
                        variant="outlined"
                        color="secondary"
                        disabled={loading}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật.'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}