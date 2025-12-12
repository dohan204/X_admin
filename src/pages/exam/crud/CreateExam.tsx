import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  TextField,
  Grid,
  Autocomplete,
  CircularProgress,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { type PropsOpenCreate, type CreateExamDto, type Subject } from "../genericModel"
import axios from "axios"

const CreateExam: React.FC<PropsOpenCreate> = ({ openCreate, handleCloseCreate, onSuccess }) => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateExamDto>({
    defaultValues: {
      name: "",
      subjectId: 0,
      numberOfQuestion: 0,
      time: 0,
    },
  })

  const getSubjects = async () => {
    setLoading(true)
    try {
      const res = await axios.get<Subject[]>("http://localhost:8089/api/Subject/subjects")
      setSubjects(res.data)
    } catch (err) {
      console.error("Lỗi tải môn học:", err)
    } finally {
      setLoading(false)
    }
  }
  console.log(subjects)
  useEffect(() => {
    if (openCreate) {
      getSubjects()
      reset()
    }
  }, [openCreate, reset])

  const onSubmit: SubmitHandler<CreateExamDto> = async (data) => {
    setLoading(true)
    try {
      await axios.post("http://localhost:8089/api/Exam/CreateWithquesition", {
        ...data,
        numberOfQuestion: Number(data.numberOfQuestion),
        time: Number(data.time),
      })
      handleCloseCreate()
      reset()
      onSuccess()
    } catch (err) {
      console.error("Lỗi tạo đề thi:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Tạo đề thi mới</Typography>
      </DialogTitle>

      <form id="create-exam-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid sx={{xs: 12, md: 6}}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Tên đề thi là bắt buộc." }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Tên đề thi"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    margin="dense"
                  />
                )}
              />

              <Controller
                name="subjectId"
                control={control}
                rules={{ required: "Vui lòng chọn môn học." }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    options={subjects}
                    getOptionLabel={(option) => option.name || ""}
                    value={subjects.find((s) => s.id === value) || null}
                    onChange={(_, newValue) => onChange(newValue?.id ?? 0)}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    loading={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Môn học"
                        error={!!error}
                        helperText={error?.message}
                        margin="dense"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading && <CircularProgress color="inherit" size={20} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid sx={{xs:12,  md:6}} >
              <Controller
                name="numberOfQuestion"
                control={control}
                rules={{
                  required: "Số câu hỏi là bắt buộc.",
                  min: { value: 1, message: "Phải lớn hơn 0." },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Số câu hỏi"
                    error={!!errors.numberOfQuestion}
                    helperText={errors.numberOfQuestion?.message}
                    margin="dense"
                    inputProps={{ min: 1 }}
                  />
                )}
              />

              <Controller
                name="time"
                control={control}
                rules={{
                  required: "Thời gian là bắt buộc.",
                  min: { value: 1, message: "Phải lớn hơn 0." },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Thời gian (phút)"
                    error={!!errors.time}
                    helperText={errors.time?.message}
                    margin="dense"
                    inputProps={{ min: 1 }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button type="submit" form="create-exam-form" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo"}
          </Button>
          <Button onClick={handleCloseCreate} disabled={loading}>
            Hủy
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateExam