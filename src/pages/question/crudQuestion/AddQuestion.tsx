import { Alert, Autocomplete, Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import type { PropsValue } from "../manager";
import {  useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import axios from "axios";
interface Subject {
    id: number, 
    name: string,
    code: string,
}
interface Question {
    subjectId: number,
    questionTypeId: number, 
    levelId: number, 
    questionContent: string,
    questionAnswer: string,
    optionA: string,
    optionB: string, 
    optionC: string, 
    optionD: string,
    optionE?: string,
    optionF?: string,
}
interface Type {
    id: number,
    typeName: string,
}
interface Level {
    id: number,
    levelName: string
}
export default function Add(props: PropsValue){
    const {open, handleOpen, handleClose, hanldeLoad} = props
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [subjects, setSubject] = useState<Subject[]>([])
    const [types, setTypes] = useState<Type[]>([])
    const [levels, setLevels] = useState<Level[]>([])

    useEffect(() => {
        const getSubject = async () => {
            try  {
                const subject = await axios.get<Subject[]>('http://localhost:8089/subjects')
                setSubject(subject.data)
                console.log(subject.data)
            } catch (err) {
                console.error('loi lay du lieu subject: ',err)
                setErrorMessage('Lỗi lấy dữ liệu.');
            }
        }
        getSubject()
    }, [])
    useEffect(() => {
        const getTypes = async () => {
            try {
                const types = await axios.get<Type[]>('http://localhost:8089/api/Type')
                setTypes(types.data)
                console.log(types.data)
            } catch (err) {
                console.error('lỗi không lấy được kiểu', err)
            }
        }
        getTypes()
    }, [])

    useEffect(() => {
        const getLevel = async () => {
            try {
                 const level = await axios.get<Level[]>('http://localhost:8089/api/Type/getLevelQuestion')
                setLevels(level.data);
                console.log(level.data)
            } catch (err) {
                console.error('loi', err)
            }
        }
        getLevel()
    }, [])
    const {control, handleSubmit, reset} = useForm<Question>({
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
    const submitData: SubmitHandler<Question> = async (data: Question) => {
        try {
            await axios.post('http://localhost:8089/api/Question/create', data)
            reset()
            await hanldeLoad();
            handleClose && handleClose();
        } catch (err) {
            console.error(err)
        } 
    }
    return (
        <div>
            <Dialog open={open} onClose={handleOpen}>
                <DialogTitle>Thêm câu hỏi</DialogTitle>
                <form onSubmit={handleSubmit(submitData)}>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <DialogContent>
                        <Grid spacing={2}>
                            <Controller
                            name='subjectId'
                            control={control}
                            rules={{required: 'trường này không được để trống.'}}
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <Autocomplete
                                    options={subjects}
                                    getOptionLabel={option => option.name}
                                    value={subjects.find(p => p.id === value) || null}
                                    onChange={(_, value) => value ? onChange(value.id) : 0}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) =>  (
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
                            render={({field: {value, onChange}, fieldState: {error}}) => (
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
                            render={({field: {value, onChange}, fieldState: {error}}) => (
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
                            render={({field, fieldState: {error}}) => (
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
                            render={({field, fieldState: {error}}) => (
                                <TextField
                                    {...field}
                                    label='Đáp án'
                                    variant="outlined"
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />

                        <Controller 
                            name='optionA'
                            control={control}
                            render={({field, fieldState: {error}}) => (
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
                            render={({field, fieldState: {error}}) => (
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
                            render={({field, fieldState: {error}}) => (
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
                            render={({field, fieldState: {error}}) => (
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
                    </DialogContent>
                    <Button type='submit'>Submit</Button>
                </form>
            </Dialog>
        </div>
    )
}