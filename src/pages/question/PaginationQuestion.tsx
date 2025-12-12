import { useState, useEffect } from "react";
import axios from "axios";
import {CircularProgress, Pagination, Stack} from '@mui/material';
import {type QuestionView, type PagedResult, type PropsPagination, type Question } from "./genericModel";
export default function PaginationQuestion(props: PropsPagination){
    debugger;
    const {subjectId, levelId, pageSize = 5, onData} = props
    const [data, setData] = useState<PagedResult<QuestionView> | null>(null)
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const fetchPage = async (pageNumber: number) => {
        setLoading(true)
        try {
            const res = await axios.get<PagedResult<QuestionView>>
            (`https://localhost:7151/api/Question/paged_Question?level=${levelId}&subject=${subjectId}&pageSize=${pageSize}&pageNumber=${pageNumber}`)
            setData(res.data)
        } catch (err) {
            console.error('lỗi,', err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchPage(page)
    }, [page, subjectId, levelId])
    useEffect(() => {if(data) onData(data.items)}, [data])
    const handleChange = (_: any, value: number) => setPage(value);
    if (loading && !data) return <CircularProgress />;

    return (
        <Stack sx={{float: 'right'}}>
            <Pagination
                count={data?.totalPages}
                page={page}
                onChange={handleChange}
                shape="rounded"
                color='primary'
            />
        </Stack>
    )
}