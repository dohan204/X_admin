import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
export default function Topic(){
    return (
        <Box sx={{
            sx: '50%',
            md: '90%',
            minHeight: '600px',
            maxHeight: '1000px',
            position: 'relative',
            borderRadius: 3,
            display: 'flex', 
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'column', 
        }}>
            <Box component={Paper}
                sx={{
                    width: '120%',
                    height: '20%',             
                }}
            >
                <Grid container spacing={2} columns={12}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Grid size={6} sx={{textAlign: 'center'}}>
                        <Typography component={'h2'} variant="h2"
                            sx={{
                                mt: 4
                            }} 
                        >
                            Quản lý chủ đề
                        </Typography>
                    </Grid>
                    <Grid size={6} sx={{textAlign: 'center'}} mt={4}>
                        <Button startIcon={<AddShoppingCartIcon />} size="large" variant="outlined">
                            Thêm chủ để
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box component={Paper}
                sx={{height: '65%', mt: 10}}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã chủ đề</TableCell>
                                <TableCell>Tên chủ để</TableCell>
                                <TableCell>Tên môn</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell>Ngày sửa</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}