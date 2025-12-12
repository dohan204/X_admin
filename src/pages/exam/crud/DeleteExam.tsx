import { useState } from "react";
import { Box, Button, Card,Alert, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { type OpenDeleteExam } from "../genericModel";
import axios from "axios";
export default function DeleteExam({openDelete, examId, handleCloseDelete, loadPageMain, title}: OpenDeleteExam){
    const [loading, setLoading] = useState<boolean>(false)
    const handleSubmit = async () => {
        setLoading(true)
        try {
            await axios.delete(`http://localhost:8089/api/Exam/examDetails/${examId}`)
            handleCloseDelete();
            loadPageMain()
        } catch (err) {
            return <Alert severity="error">Loi:</Alert>
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box>
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>
                    Xóa đề thi.
                </DialogTitle>
                <DialogContent>
                    <Card>
                        <CardContent>
                            <Typography component={'h3'} variant="h3" color="red">
                                Bạn có chắc là muốn xóa "{title}" này không?
                            </Typography>
                            <Typography>
                                hành đông này sẽ không thể hoàn tác
                            </Typography>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit}>
                        {loading ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                    <Button onClick={handleCloseDelete}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}