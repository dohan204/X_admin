import React, { useEffect, useState } from "react";
import type { PropsEdit } from "../manager";
import {
    Box, Dialog, DialogContent, DialogTitle, Typography,
    Stack, Autocomplete, TextField,
    Button,
    Grid,
    DialogActions
} from "@mui/material";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import styles from '../StyleGlobalForQuesion.module.css'
import {
    type Subject,
    type Level, type Question, type Type, type QuestionView
} from "../genericModel";
import axios from "axios";


export default function EditQuestion(props: PropsEdit) {
    const { open, handleCloseEdit, question } = props
    const [loading, setLoading] = useState<boolean>(false)
    // const [questions, setQuestion] = useState<null>(null)
    const [subjects, setSubject] = useState<Subject[]>([]);
    const [levels, setLevel] = useState<Level[]>([])
    const [types, setType] = useState<Type[]>([])

    const { control, handleSubmit, reset } = useForm<Question>({
        defaultValues: {
            subjectId: 0,
            questionTypeId: 0,
            levelId: 0,
            questionContent: '',
            questionAnswer: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            optionE: '',
            optionF: ''
        }
    })
    useEffect(() => {

        const fetchData = async () => {
            setLoading(true)
            try {
                const [subRes, levelRes, typeRes] = await Promise.all([
                    axios.get<Subject[]>('http://localhost:8089/subjects'),
                    axios.get<Level[]>('http://localhost:8089/api/Type/getLevelQuestion'),
                    axios.get<Type[]>('http://localhost:8089/api/Type'),
                ])

                setSubject(subRes.data);
                setLevel(levelRes.data);
                setType(typeRes.data);
            } catch (error) {
                console.error('lỗi, ', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if(!question) {
            // Nếu không có ID câu hỏi, có thể reset form về trạng thái trống
            reset({
                subjectId: 0,
                questionTypeId: 0,
                levelId: 0,
                questionContent: '',
                questionAnswer: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                optionE: '',
                optionF: ''
            });
            return;
        }
                const fetchQuestionData = async () => {
            try {
                // API trả về dữ liệu theo model QuestionView (có cả ID và Name)
                // Lưu ý: Tên trường trong API response cần khớp với QuestionView
                const qRes = await axios.get<QuestionView>(`http://localhost:8089/api/Question/question/${question}?id=${question}`);
                
                // qRes.data có cấu trúc gần giống với Question (chỉ khác tên trường nội dung)
                const apiData = qRes.data;

                // CHUYỂN ĐỔI NHẸ TÊN TRƯỜNG CHO KHỚP VỚI MODEL Question của Form
                const formData: Question = {
                    id: question, 
                    subjectId: apiData.subjectId,
                    questionTypeId: apiData.questionTypeId,
                    levelId: apiData.levelId,
                    // Thay đổi 'content' thành 'questionContent'
                    questionContent: apiData.content, 
                    // Thay đổi 'answer' thành 'questionAnswer'
                    questionAnswer: apiData.answer, 
                    optionA: apiData.optionA,
                    optionB: apiData.optionB,
                    optionC: apiData.optionC,
                    optionD: apiData.optionD,
                    optionE: apiData.optionE,
                    optionF: apiData.optionF,
                };
                
                // Sử dụng reset() để thiết lập dữ liệu lên form
                reset(formData); 
                
            } catch (error) {
                console.error('lỗi khi fetch dữ liệu câu hỏi, ', error)
            }
        }

        fetchQuestionData();
    }, [question, reset])
    const onSubmit: SubmitHandler<Question> = async (data: Question) => {
        setLoading(true)
        console.log('dữ liệu sau khi chỉnh sửa: ', data)
        try {
            await axios.put('http://localhost:8089/api/Question/update_Question', data)
            props.handleLoad()
            props.handleCloseEdit();
        } catch (error) {
            console.error('lỗi không gửi được dữ liệu,', error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <React.Fragment>
            <Box sx={{ width: 1200, height: 'auto', }}>
                <Dialog open={open} onClose={handleCloseEdit}
                    maxWidth='xl'
                >
                    <DialogTitle>
                        <Typography color='secondary'>
                            Chỉnh sửa câu hỏi
                        </Typography>
                    </DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <DialogContent>
                            <Stack spacing={2}>
                                <Grid container sx={{pt: 2, m: 1}}>
                                    <Grid sx={{ sx: 12, sm: 6 , display: 'flex', flexDirection: 'row',flexWrap: 'nowrap', width: 'auto', float: 'left', m: 1}}>
                                        <Controller
                                            name='subjectId'
                                            control={control}
                                            rules={{ required: 'trường này không được để trống.' }}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    options={subjects}
                                                    getOptionLabel={option => option.name}
                                                    value={subjects.find(p => p.id === value) || null}
                                                    onChange={(_, value) => onChange(value ? value.id : 0)}
                                                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            label='Môn'
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name='questionTypeId'
                                            control={control}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    options={types}
                                                    getOptionLabel={option => option.typeName}
                                                    value={types.find(t => t.id === value) || null}
                                                    onChange={(_, value) => {
                                                        const newValue = value ? value.id : 0
                                                        onChange(newValue)
                                                    }}
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label='Kiểu câu hỏi'
                                                            variant="outlined"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name='levelId'
                                            control={control}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    options={levels}
                                                    getOptionLabel={option => option.levelName}
                                                    value={levels.find(l => l.id === value)}
                                                    onChange={(_, value) => value ? onChange(value.id) : 0}
                                                    isOptionEqualToValue={(o, v) => o.id === v.id}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label='Độ khó'
                                                            variant="outlined"
                                                            error={!!error}
                                                            helperText={error?.message}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name='questionContent'
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label='Nội dung câu hỏi.'
                                                    variant="outlined"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name='questionAnswer'
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label='Đáp án'
                                                    variant="outlined"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid sx={{ xs: 12, md: 6 ,display: 'flex', flexDirection: 'column', width: 300, float: 'right'}}>
                                        <Controller
                                            name='optionA'
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label='Đáp án A'
                                                    variant="outlined"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name='optionB'
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label='Đáp án B'
                                                    variant="outlined"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name='optionC'
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label='Đáp án C'
                                                    variant="outlined"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name='optionD'
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label='Đáp án D'
                                                    variant="outlined"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                            </Stack>
                        </DialogContent>
                        <DialogActions>
                             <Button
                                disabled={loading ? true : false}
                                type='submit'
                                variant="outlined"
                                color='secondary'
                            >Lưu</Button>
                            <Button onClick={handleCloseEdit}>
                                Hủy
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </React.Fragment>
    )
}