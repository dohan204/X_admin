import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import type { DelProps } from "./model/modelProps/del";
import { useState } from "react";
import axios from "axios";

export default function DeleteSubject({open, id, name, handleClose, refresh}: DelProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const handleDeleteSub = async () => {
        setLoading(true)
        try {
            await axios.delete(`http://localhost:8089/api/Subject/Delete/${id}`)
            handleClose()
            refresh()
        } catch (err) {
            console.error('lỗi: ', err)
        } finally {
            setLoading(false)
        }
    }
    return (    
        <Dialog open={open}>
            <DialogTitle>
                <Typography component={'h2'} variant="h2" color='error'>
                    Xóa môn học
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText color='secondary'>
                    Bạn có chắc muốn xóa môn {name} <br />
                    Nếu xóa thì sẽ không thẻ hoàn tác.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteSub}>
                    {loading ? 'Đang xóa...' : 'Xóa'}
                </Button>
                <Button onClick={handleClose}>
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    )
}