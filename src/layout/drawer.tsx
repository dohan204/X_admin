import { Box } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useNavigate } from 'react-router-dom';
export default function Drawers(){
    const navigate = useNavigate();
    const handleNextPage = (path: string) => {
        navigate(path);
    }
    return (
        <Box sx={{width: '280px'}}>
            <SimpleTreeView>
                <TreeItem itemId='dashboard' label='Dash Board' onClick={() => handleNextPage('/dashboard')}  />
                <TreeItem itemId = 'role' label='Role '>
                    <TreeItem itemId='role-index' label = 'Home' onClick={() => handleNextPage('/role')} />
                    <TreeItem itemId='role-manager' label = 'Manager' onClick={() => handleNextPage('/role/manager')} />
                    <TreeItem itemId='role-decentralization' label = 'Decentralization' />
                </TreeItem>
                <TreeItem itemId='user' label='User'>
                    <TreeItem itemId='user-index' label= 'Home' onClick={() => handleNextPage('/account')} />
                    <TreeItem itemId='user-manager' label = 'Manager' onClick={() => handleNextPage('/account/authUser')} />
                </TreeItem>
                <TreeItem itemId='subject' label='Subject' >
                    <TreeItem itemId='subject-index' label = 'Quản lý chung' onClick={() => handleNextPage('/subject')} />
                    <TreeItem itemId='subject-manager' label='Quản lý môn thi' />
                </TreeItem>
                <TreeItem itemId='question' label='Question' >
                    <TreeItem itemId='question-index' label = 'Ngân hàng câu hỏi' onClick={() => handleNextPage('/question/manager')} />
                    {/* <TreeItem itemId='question-manager' label = 'Quản lý danh sách câu hỏi' onClick={() => handleNextPage('/manager')} />     */}
                </TreeItem>
                <TreeItem itemId='exam' label='Exam'>
                    <TreeItem itemId='exam-index' label='Bài thi/ đề thi' onClick={() => handleNextPage('/mainExam')} />
                    <TreeItem itemId='exam-manager' label ='Quản lý đè thi' />
                </TreeItem>
                <TreeItem itemId='rating' label='Rating' >
                    <TreeItem itemId='rating-score' label='Điểm thi' />
                    <TreeItem itemId='rating-subject' label='Môn thi' />
                    <TreeItem itemId='rating-different' label='Xếp loại khác' />
                </TreeItem>
            </SimpleTreeView>
        </Box>
    )
}