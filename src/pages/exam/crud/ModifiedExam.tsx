import { useEffect, useState } from "react";
import {
  type OpenModifiedExam,
  type ResponseExamFromApi,
} from "../genericModel";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

export default function ModifiedExam({
  openModified,
  handleCloseModified,
  loadPageMain,
  examId,
}: OpenModifiedExam) {
  const [examDetails, setExamDetails] = useState<ResponseExamFromApi | null>(null);
  const [loading, setLoading] = useState(false);

  const getExamDetails = async () => {
    if (!examId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8089/api/Exam/examDetails/${examId}`
      );
      setExamDetails(res.data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết đề thi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openModified) {
      getExamDetails();
    }
  }, [examId, openModified]);

  return (
    <Dialog
      open={openModified}
      onClose={handleCloseModified}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Chi tiết đề thi</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        {loading ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : examDetails ? (
          <>
            {/* Thông tin đề thi */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {examDetails.subjectName}
                </Typography>
                <Typography>
                  Số câu hỏi: {examDetails.numberOfQuestion}
                </Typography>
                <Typography>
                  Thời gian làm bài: {examDetails.timeTest} phút
                </Typography>
              </CardContent>
            </Card>

            {/* Danh sách câu hỏi */}
            {examDetails.question.map((q, index) => (
              <Accordion key={q.id} sx={{ mb: 2, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Câu {index + 1}: {q.content}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ ml: 2 }}>
                    {["A", "B", "C", "D", "E", "F"].map((opt) => {
                      const value = q[`option${opt}` as keyof typeof q];
                      if (!value) return null;
                      const isCorrect = opt === q.answer;
                      return (
                        <Typography
                          key={opt}
                          sx={{
                            color: isCorrect ? "green" : "inherit",
                            fontWeight: isCorrect ? "bold" : "normal",
                            mb: 0.5,
                          }}
                        >
                          {opt}.{value.toLocaleString()}
                        </Typography>
                      );
                    })}
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      Tạo lúc: {new Date(q.createdAt).toLocaleString()} <br />
                      Cập nhật: {new Date(q.modifiedAt).toLocaleString()}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        ) : (
          <Typography color="text.secondary">Không có dữ liệu.</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            loadPageMain(); // nếu mày muốn reload danh sách chính sau khi sửa
            handleCloseModified();
          }}
        >
          Lưu
        </Button>
        <Button color="error" onClick={handleCloseModified}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
}
