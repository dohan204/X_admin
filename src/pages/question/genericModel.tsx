export interface Question {
    id: number,
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
export interface QuestionView {
    id: number
    subjectId: number
    subjectName: string,
    questionTypeId: number,
    typeName: string, 
    levelId: number
    levelName: string, 
    content: string,
    answer: string,
    optionA: string,
    optionB: string, 
    optionC: string, 
    optionD: string,
    optionE?: string,
    optionF?: string,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string
}
export interface Subject {
    id: number, 
    name: string,
    code: string,
}
export interface Type {
    id: number,
    typeName: string,
}
export interface Level {
    id: number,
    levelName: string
}
export interface PagedResult<T> {
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    totalPages: number,
    items: T[]
}
export interface PropsPagination {
    subjectId: number | null,
    levelId: number | null,
    pageNumber?: number,
    pageSize?: number,
    totalCount?: number,
    totalPages?: number,
    onData: (items: QuestionView[]) => void
}