import React from 'react'
import {
    Alert,
    Paper, Table,
    TableCell,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    IconButton,
    Button,
    Stack,
    TablePagination,
    Box
} from "@mui/material"
import axios from "axios"
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useEffect, useState } from "react"
import Add from "./crudQuestion/AddQuestion";
import EditQuestion from './crudQuestion/UpdateQuestion';
import Delete from './crudQuestion/deleteQuestion';
// import PaginationQuestion from './PaginationQuestion';
import { type Subject, type Level, type QuestionView } from './genericModel';
// interface Question {
//     id: number,
//     subjectName: string,
//     levelName: string,
//     typeName: string,
//     content: string,
//     answer: string,
//     optionA: string,
//     optionB: string,
//     optionC: string,
//     optionD: string,
//     createdAt: Date,
//     createdBy: string,
//     updatedAt: Date,
//     updatedBy: string
// }
export interface PropsValue {
    open: boolean,
    handleOpen?: () => void,
    handleClose?: () => void
    hanldeLoad: () => void
}
export interface PropsEdit {
    open: boolean,
    question: number | null
    handleOpenEdit: () => void
    handleCloseEdit: () => void
    handleLoad: () => void
}
export interface PropsDel {
    open: boolean,
    id: number | null
    handleCloseDel: () => void
}
export default function ManagerQuestion() {
    const [loading, setLoading] = useState<boolean>(false)
    const [level, setLevel] = useState<Level[]>([])
    const [subject, setSubject] = useState<Subject[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [questions, setQuestions] = useState<QuestionView[]>([])
    const [question, setQuestion] = useState<number | null>(null)
    const [open, setOpen] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [openDel, setOpenDel] = useState<boolean>(false)
    const [page, setPage] = useState<number>(0)
    const [rowsPerPage, setRowPerPage] = useState<number>(10)

    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const paginatedData = questions.slice(startIndex, endIndex)

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subjectRes, levelRes] = await Promise.all([
                    axios.get<Subject[]>('http://localhost:8089/subjects'),
                    axios.get<Level[]>('http://localhost:8089/api/Type/getLevelQuestion')
                ])

                const subjects = subjectRes.data
                const levels = levelRes.data

                setLevel(levels)
                setSubject(subjects)
            } catch (error) {
                console.error('lỗi rồi', error)
            }
        }
        fetchData()
    }, [])
    const handleOpenDel = (id: number) => {
        setOpenDel(!openDel)
        setQuestion(id)
    }

    const handleOpen = () => setOpen(!open)

    const handleOpenEdit = (id: number) => {
        setQuestion(id)
        setOpenEdit(openEdit => !openEdit)
    }

    const handleCloseEdit = () => setOpenEdit(false)


    const getAllQuestionFromDb = async () => {
        setLoading(true)
        try {
            const res = await axios.get<QuestionView[]>('http://localhost:8089/api/Question/GetAllquestion')
            setQuestions(res.data)
        } catch (error) {
            console.error('loi,', error)
            setErrorMessage("loi khong the tai duoc du liệu.");
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllQuestionFromDb()
    }, [])
    if (questions.length === 0 || !questions)
        return <Alert>Không có dữ liệu câu hỏi.</Alert>
    return (
        <Box
            width={'auto'}
        >
            {errorMessage && <Alert>không có dư liệu được lấy ra.</Alert>}
            <Stack spacing={2} direction={'row'} sx={{m: 2,}} >
                <Button startIcon={<AutoFixHighIcon color='secondary' />} variant="contained" 
                    sx={{position: 'relative'}}
                 size="medium" onClick={handleOpen}>
                    Thêm câu hỏi
                </Button>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mb: 2, pl: 80 }}>

            </Stack>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '1250',
            }}>
                <TableContainer component={Paper} >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Tên Môn</TableCell>
                                <TableCell>Độ khó</TableCell>
                                <TableCell>Kiểu câu hỏi</TableCell>
                                <TableCell>Nội dung</TableCell>
                                <TableCell>Đáp án</TableCell>
                                <TableCell>A</TableCell>
                                <TableCell>B</TableCell>
                                <TableCell>C</TableCell>
                                <TableCell>D</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell>Người tạo</TableCell>
                                <TableCell>Ngày sửa</TableCell>
                                <TableCell>Người sửa</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell>{q.id}</TableCell>
                                    <TableCell>{q.subjectName}</TableCell>
                                    <TableCell>{q.levelName}</TableCell>
                                    <TableCell>{q.typeName}</TableCell>
                                    <TableCell>{q.content}</TableCell>
                                    <TableCell>{q.answer}</TableCell>
                                    <TableCell>{q.optionA}</TableCell>
                                    <TableCell>{q.optionB}</TableCell>
                                    <TableCell>{q.optionC}</TableCell>
                                    <TableCell>{q.optionD}</TableCell>
                                    <TableCell>{new Date(q.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{q.createdBy}</TableCell>
                                    <TableCell>{new Date(q.updatedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{q.updatedBy}</TableCell>
                                    <TableCell>
                                        <Stack direction="row">
                                            <IconButton onClick={() => handleOpenEdit(q.id)}>
                                                <EditNoteIcon color='primary' />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenDel(q.id)}>
                                                <RemoveShoppingCartIcon color='error' />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component={'div'}
                        count={questions.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
                        onRowsPerPageChange={handleChangeRowPerPage}
                    />
                </TableContainer>
                {/* <PaginationQuestion subjectId={selectedSubjectId} levelId={selectedLevelId} pageSize={10} onData={setQuestions} /> */}
            </Box>
            <Add open={open} handleOpen={handleOpen} hanldeLoad={getAllQuestionFromDb} />
            <EditQuestion open={openEdit}
                handleCloseEdit={handleCloseEdit} handleOpenEdit={() =>
                    setOpenEdit(true)} question={question} handleLoad={getAllQuestionFromDb} />
            <Delete open={openDel} id={question} handleCloseDel={() => setOpenDel(!openDel)} />
        </Box>
    )
}


