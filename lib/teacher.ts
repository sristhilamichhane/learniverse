export const isTeacher =(userID?:string|null)=>{
    return userID === process.env.NEXT_PUBLIC_TEACHER_ID
}