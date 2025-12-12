import {
    Box, Grid,
    Paper, Button,
    Typography, TextField,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    TablePagination,
    MenuItem,
    IconButton,
} from "@mui/material";
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { type Subject, type ExamView, type Level } from "./genericModel";
import axios from "axios";
import CreateExam from "./crud/CreateExam";
import ModifiedExam from "./crud/ModifiedExam";
import DeleteExam from "./crud/DeleteExam";
import { Outlet, useLocation } from "react-router-dom";
export default function ExamMain() {
    const location = useLocation()
    const [subjects, setSubject] = useState<Subject[]>([])
    const [levels, setLevel] = useState<Level[]>([])
    const [exams, setExam] = useState<ExamView[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [query, setQuery] = useState<string>("")
    const [filterResult, setFilterResult] = useState<ExamView[]>([])
    console.log(subjects);

    const [openCreate, setOpenCreate] = useState<boolean>(false)
    const [openModified, setOpenModified] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)

    const [page, setPage] = useState<number>(0)
    const [rowsPerPage, setRowPerPage] = useState<number>(5)
    const [subjectSelected, setSubjectSelected] = useState<string>("")
    const [levelSelected, setLevelSelected] = useState<string>("")
    const [selectedExamId, setSelectedExamId] = useState<number>(0)
    const [selectedTitle, setSelectedTitle] = useState<string>("")
    // const handleQueryResult = (exams: ExamView[] , query: string) => {
    //     query = query.toLowerCase()
    //     return exams.filter((item) => item.title.toLowerCase().includes(query))
    // }
    const routingTopic = location.pathname.endsWith('/topic')
    const handleOpenDeleteExam = (id: number, name: string) => {
        setSelectedExamId(id)
        setSelectedTitle(name)
        setOpenDelete(true)
    }
    const handleCloseDelete = () => setOpenDelete(false)
    const handleResetInput = () => {
        setQuery('')
        setSubjectSelected('')
        setLevelSelected('')
    }
    // const handleChangeSubject = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    //     setSubjectSelected(event.target.value as string)
    // }

    const handleChangeLevel = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setLevelSelected(event.target.value)
    }

    const handleOpenCreate = () => setOpenCreate(true)
    const handleCloseCreate = () => setOpenCreate(false)

    const handleOpenModified = (id: number) => {
        setOpenModified(true)
        setSelectedExamId(id)
    }
    const handleCloseModified = () => setOpenModified(false)
    const getExams = async () => {
        setLoading(true)
        try {
            const res = await axios.get<ExamView[]>('http://localhost:8089/api/Exam/exams')
            setExam(res.data)
        } catch (err) {
            console.error('Lỗi tải dữ liệu', err)
        } finally {
            setLoading(false)
        }
    }
    const handleRefresh = () => getExams()
    const getData = useCallback(() => {
        const getSubAndLevel = async () => {
            const [resSub, resLev] = await Promise.all([
                axios.get('http://localhost:8089/subjects'),
                axios.get('http://localhost:8089/api/Type/getLevelQuestion')
            ])
            setSubject(resSub.data)
            setLevel(resLev.data)
        }
        getSubAndLevel()
    }, [])
    useEffect(() => {
        getData()
        getExams()
    }, [])
    useEffect(() => {
        if (!exams.length)
            return
        // khi có dữ liệu gán nó vào biến khác result
        let result = exams

        // lọc theo từ khóa 
        if (query && query.trim() !== '') {
            const q = query.toLowerCase().trim()
            result = result.filter(exam => exam.title.toLowerCase().includes(q) || exam.subjectName.toLowerCase().includes(q))
        }

        // lọc theo môn học 
        if (subjectSelected) {
            result = result.filter(exam => exam.subjectName === subjectSelected)
        }
        setFilterResult(result)
    }, [query, exams])

    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const paginatedData = filterResult.slice(startIndex, endIndex)

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }
    const handleChangeRowPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    return (
        <>
            {!routingTopic && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '79vw',
                    borderRadius: 2,
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: '98%',
                        justifyContent: 'space-between',
                        height: 100,
                        borderRadius: 2,
                        m: 1
                    }} component={Paper}>
                        <Grid container spacing={2} sx={{ width: '100%' }}>
                            <Grid size={6} sx={{ borderRadius: 2, textAlign: 'center' }}>
                                <Typography component={'h2'} variant="h2" pt={1} sx={{ fontFamily: 'time new roman', color: 'purple' }}  >
                                    Quản lý đề thi
                                </Typography>
                            </Grid>
                            <Grid size={6} container justifyContent="space-around" alignItems="center" spacing={2} >
                                <Grid>
                                    <Button variant="contained" color="primary"
                                        onClick={handleOpenCreate}
                                    >
                                        + Tạo đề thi
                                    </Button>
                                </Grid>
                                <Grid>
                                    <Button variant="outlined">
                                        Export
                                    </Button>
                                </Grid>
                                <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                                < ManageSearchIcon />
                                    
                                    <TextField
                                        
                                        label="Tìm kiếm"
                                        variant="standard"
                                        fullWidth
                                        value={query}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setQuery(event.target.value as string)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ width: '98%', height: 500, borderRadius: 2 }} m={1}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã đề thi</TableCell>
                                        <TableCell>Tên đề thi</TableCell>
                                        <TableCell>Môn thi</TableCell>
                                        <TableCell>Số câu hỏi</TableCell>
                                        <TableCell>Thời gian làm</TableCell>
                                        <TableCell>Ngày tạo</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!loading && paginatedData.map((exam) => (
                                        <TableRow key={exam.id}>
                                            <TableCell>{exam.id}</TableCell>
                                            <TableCell>{exam.title}</TableCell>
                                            <TableCell>{exam.subjectName}</TableCell>
                                            <TableCell>{exam.numberOfQuestion}</TableCell>
                                            <TableCell>{exam.testingTime}</TableCell>
                                            <TableCell>
                                                {exam.examDay ? new Date(exam.examDay).toLocaleDateString("vi-VN") : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleOpenModified(exam.id)}>
                                                    <AutoFixNormalIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleOpenDeleteExam(exam.id, exam.title)}>
                                                    <HighlightOffIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component={'div'}
                                count={filterResult.length}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handleChangePage}
                                rowsPerPageOptions={[5, 10, 25]}
                                labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
                                onRowsPerPageChange={handleChangeRowPerPage}
                            />
                        </TableContainer>
                        <CreateExam openCreate={openCreate} handleCloseCreate={handleCloseCreate} onSuccess={handleRefresh} />
                        <ModifiedExam
                            openModified={openModified}
                            handleCloseModified={handleCloseModified}
                            examId={selectedExamId}
                            loadPageMain={handleRefresh} />
                        <DeleteExam
                            openDelete={openDelete}
                            handleCloseDelete={handleCloseDelete}
                            examId={selectedExamId}
                            loadPageMain={handleRefresh}
                            title={selectedTitle}
                        />
                    </Box>
                </Box>
            )}
            <Outlet />
        </>
    )
}