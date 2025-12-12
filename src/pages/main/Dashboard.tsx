import { Box, Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import PieActiveArc from "./charts/PieActiveArc";
import LineCharts from "./charts/LineChart";
import ScatterDataset from "./charts/ScatterChart";

export default function Dashboard() {
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            top={10}
            right={9}
            width={'auto'}
            p={1}
            height={800}

        >
            <Grid container spacing={2} width={'100%'} height={'25%'} p={1}
                component={Paper}
            >
                <Grid width={'32%'} height={'100%'}>
                    <Card
                        sx={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <PieActiveArc />
                    </Card>
                </Grid>
                <Grid width={'32%'} height={'100%'}>
                    <Card
                        sx={{
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <LineCharts />
                    </Card>
                </Grid>
                <Grid width={'32%'} height={'100%'}>
                    <Card
                        sx={{
                            width: '100%',
                            height: '100%'
                        }}
                    >

                    </Card>
                </Grid>
            </Grid>
            <Grid sx={{ width: '100%', height: '25%', display: 'flex', flexDirection: 'row', m: 1, p: 1, justifyContent: 'space-between' }}>
                <Grid sx={{ width: '24%', height: '100%' }}>
                    <Card sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: '#33eb91',
                        cursor: "pointer",
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                        }
                    }}>
                        <CardContent>
                            <Typography component={'h4'} variant="h4" color="warning">
                                Quản lý người dùng
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid sx={{ width: '24%', height: '100%' }}>
                    <Card sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: '#dedede',
                        cursor: "pointer",
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 20px rgba(154, 59, 84, 0.15)'
                        }
                    }}>
                        <CardContent>
                            <Typography component={'h4'} variant="h4" color="error">
                                Quản lý vai trò
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid sx={{ width: '24%', height: '100%' }}>
                    <Card sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: '#c2c2c2',
                        cursor: "pointer",
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                        }
                    }}>
                        <CardContent>
                            <Typography component={'h4'} variant="h4" color="info" >
                                Ngân hàng câu hỏi
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid sx={{ width: '24%', height: '100%' }}>
                    <Card sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: 'lightpink',
                        cursor: "pointer",
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                        }
                    }}>
                        <CardContent>
                            <Typography component={'h4'} variant="h4" color="secondary">
                                P&Q
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid height={'40%'}
                width={'100%'}
                m={1}
            >
                <ScatterDataset />
            </Grid>
        </Box>
    )
}