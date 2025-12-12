import { Controller, type SubmitHandler } from "react-hook-form";
import { type Add } from "./model/Add";
import { type AddProps } from "./model/modelProps/add";
import { useForm } from 'react-hook-form'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import styles from './styles.module.css'
export default function AddSubject({ open, handleOpen, refresh }: AddProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { control, handleSubmit, reset } = useForm<Add>({
        defaultValues: {
            name: '',
            code: '',
        }
    })

    const handleSubmitData: SubmitHandler<Add> = async (data: Add) => {
        console.log(data)
        setLoading(true)
        try {
            await axios.post('http://localhost:8089/api/Subject/Create',data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            handleOpen()
            refresh()
            reset()
        } catch (err) {
            console.error('lỗi,', err)
        } finally {
            setLoading(false)
        }

    }
    return (
        <Box>
            <Dialog open={open}>
                <DialogTitle>
                    <Typography component={'h3'} variant="h3">
                        Thêm môn học mới
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <form className={styles.form}>
                        <Controller
                            name='name'
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label='Tên môn'
                                    variant="outlined"
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />
                        <Controller
                            name='code'
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label='Mã môn'
                                    variant="outlined"
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit(handleSubmitData)} disabled={loading}>
                        Thêm
                    </Button>
                    <Button onClick={handleOpen}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}