import { Box, Paper, Typography } from "@mui/material";

export default function NotFound(){
    return <Box component={Paper}>
        <Typography fontSize={50} >
            404
        </Typography>
        <Typography color='error'>
            Không có trang như m đang tìm đâu, kiểm tra lại đi.
        </Typography>
    </Box>
}