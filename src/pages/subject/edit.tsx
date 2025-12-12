import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { ModifiedProps } from "./model/modelProps/edit";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import {type Update} from './model/Update'
import { useEffect, useState } from "react";
import styles from './styles.module.css'
import axios from "axios";
export default function ModifiedSubject({open, subjectId, handleClose, refresh}: ModifiedProps){
    const [loading, setLoading] = useState<boolean>(false)
    const [subject, setSubject] = useState<Update | null>(null)
    const {control, handleSubmit, reset} = useForm<Update>({defaultValues: {
        name: '',
        code: ''
    }})

    const getSubjectById = async () => {
        setLoading(true)
        try {
            const res =await axios.get(`http://localhost:8089/api/Subject/subjects/${subjectId}`)
            setSubject(res.data)

            reset({
                name: subject?.name,
                code: subject?.code
            })
        } catch (error) {
            console.error('lỗi', error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getSubjectById()
    }, [subjectId, open])

    const onSubmit: SubmitHandler<Update> = async (data: Update) => {
        setLoading(true)
        await axios.put(`http://localhost:8089/api/Subject/Update_subject?id=${subjectId}`, data)
        handleClose()
        refresh()
        reset()
    }
    return (
        <Box>
            <Dialog open={open}>
                <DialogTitle>
                    Chỉnh sửa thông tin
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
                    <Button disabled={loading} onClick={handleSubmit(onSubmit)}>
                        Lưu
                    </Button>
                    <Button onClick={handleClose}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}