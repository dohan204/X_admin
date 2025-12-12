import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import type { PropsDel } from "../manager";

export default function Delete(props: PropsDel){
    const {open} = props
    return (
        <>
            <Dialog open={open}>
                <DialogTitle>
                    <Typography>
                        Bạn có chắc là muốn xóa câu hỏi này đi không?.
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    
                </DialogContent>
            </Dialog>
        </>
    )
}