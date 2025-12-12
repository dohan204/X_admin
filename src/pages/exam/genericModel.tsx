export interface ExamView {
    id: number,
    title: string, 
    numberOfQuestion: number,
    subjectName: string, 
    testingTime: number,
    examDay: Date | null
}
export interface PropsOpenCreate {
    openCreate: boolean
    handleCloseCreate: () => void
    onSuccess: () => void
}
export interface CreateExamDto  {
    name: string,
    subjectId: number,
    numberOfQuestion: number 
    examDate?: Date | null,
    time: number 
}
export interface Subject {
    id: number,
    name: string,
    code: string,
    questions: null,
    exams: null
}
export interface Level {
    id: number, 
    levelName: string,
}
export interface OpenModifiedExam {
    examId: number | null
    openModified: boolean,
    handleCloseModified: () => void
    loadPageMain: () => void
}
export interface ResponseExamFromApi {
    id: number, 
    subjectName: string,
    numberOfQuestion: number,
    timeTest: number,
    question: Question[]
}
export interface Question {
    id: number,
    content: string,
    answer: string,
    optionA: string,
    optionB: string,
    optionC: string,
    optionD: string,
    optionE: string,
    optionF: string,
    createdAt: Date,
    modifiedAt: Date,
}
export interface OpenDeleteExam {
    openDelete: boolean,
    examId: number
    handleCloseDelete: () => void,
    loadPageMain: () => void
    title: string | null
}