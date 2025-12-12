import {
  Alert,
  Backdrop,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  CircularProgress,
  TableBody,
  TableCell,
  Button,
  Paper,
  Card,
  IconButton,
} from "@mui/material";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DrawIcon from '@mui/icons-material/Draw';
import { useEffect, useState } from "react";
import axios from "axios";
import AddSubject from "./add";
import ModifiedSubject from "./edit";
import DeleteSubject from "./delete";

interface Subject {
  id: number;
  name: string;
  code: string;
}

const MainSubject: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setMessage] = useState<string | null>(null);
  const [subject, setSubject] = useState<Subject[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDel, setOpenDel] = useState<boolean>(false)
  const [subjectId, setSubjectId] = useState<number>(0);
  const [name, setName] = useState<string>('')
  const handleOpenEdit = (id: number) => {
    setSubjectId(id)
    setOpenEdit(true)
  }
  const handleCloseEdit = () => setOpenEdit(false);
  const handleOpen = () => setOpenAdd(true)
  const handleClose = () => setOpenAdd(false)
  const handleOpenDelete = (id: number,name: string) => {
    setOpenDel(true)
    setSubjectId(id)
    setName(name)
  }
  const handleCloseDelete = () => setOpenDel(false)
  const getSubject = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8089/api/Subject/subjects");
        setSubject(res.data);
      } catch (err) {
        console.log("Error: ", err);
        setMessage("Lỗi: Không thể lấy được dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    
    getSubject();
  }, []);
  const handleRefresh = () => {
    getSubject()
  }
  if (errorMessage)
    return <Alert severity="error">{errorMessage}</Alert>;

  if (!loading && subject.length === 0)
    return <Alert severity="info">Không có dữ liệu.</Alert>;

  return (
    <Box
      sx={{width: '79vw',display: 'flex', flexDirection: 'column', m: 1}} component={Paper}
    >
      {/* Backdrop loading */}
      <Backdrop
        open={loading}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#fff",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Button onClick={handleOpen} sx={{width: '10%'}}>
        Tạo mới
      </Button>
      <Box>
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{backgroundColor: 'lightpink'}}>
              <TableCell>ID</TableCell>
              <TableCell>Mã môn học</TableCell>
              <TableCell>Tên môn học</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subject.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.code}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEdit(s.id)}>
                    <DrawIcon color="secondary" />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDelete(s.id, s.name)}>
                    <DeleteSweepIcon color="info" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
      <AddSubject open={openAdd} handleOpen={handleClose} refresh={handleRefresh} />
      <ModifiedSubject open={openEdit} subjectId={subjectId} handleClose={handleCloseEdit} refresh={handleRefresh} />
      <DeleteSubject id={subjectId} name={name} open={openDel} handleClose={handleCloseDelete} refresh={handleRefresh} />
    </Box>
  );
};

export default MainSubject;
