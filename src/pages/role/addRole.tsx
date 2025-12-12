import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button, TextField } from '@mui/material'
import { type AddNewRoleProps, type AddNewRoleParameter } from './genericModel'
import Slide from '@mui/material/Slide';
import { type TransitionProps } from '@mui/material/transitions';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { forwardRef, useState, type ReactElement, type Ref } from 'react';
import axios from 'axios';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>
    }, ref: Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />
});
export default function AddRole({ openAddRole, handleCloseAddRole, loadData }: AddNewRoleProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { control, handleSubmit, reset } = useForm<AddNewRoleParameter>({
        defaultValues: {
            name: '',
            description: ''
        }
    })

    const onSubmit: SubmitHandler<AddNewRoleParameter> = async (data: AddNewRoleParameter) => {
        console.log('dữ liệu guier lên sv,', data)
        setLoading(true)
        try {
            await axios.post('http://localhost:8089/api/Role', data)
            handleCloseAddRole()
            reset()
            loadData()
        } catch (err) {
            console.error('lỗi không đăng ký được', err)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Box>
            <Dialog open={openAddRole}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleCloseAddRole}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Typography color='success' component={'h3'} variant='h3'>
                        Thêm Vai trò mới
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{m: 1}}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name='name'
                            control={control}
                            rules={{required: 'Tên vai trò không được để trông.'}}
                            render={({field, fieldState: {error}}) => (
                                <TextField
                                    {...field}
                                    label='Tên vai trò...'
                                    variant='standard'
                                    error={!!error}
                                    helperText={error?.message}
                                />  
                            )}
                        />
                        <Controller
                            name='description'
                            control={control}
                            rules={{required: 'Mô tả không được để trông.'}}
                            render={({field, fieldState: {error}}) => (
                                <TextField
                                    {...field}
                                    label='Mô tả...'
                                    variant='standard'
                                    error={!!error}
                                    helperText={'mô tả ngắn thôi không có hết chỗ.'}
                                />  
                            )}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit(onSubmit)}>
                        {loading ? 'Đang tạo...' : 'Tạo'}
                    </Button>
                    <Button onClick={handleCloseAddRole}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}