import axios from "axios"
import { useEffect, useState } from "react"

const useGetById = (id: string) => {
    const [userData, setUserData] = useState(null)
    useEffect(() => {
        if(!id) return 
        axios.get(`http://localhost:8089/api/Account/getbyId/${id}`)
        .then(res => setUserData(res.data))
        .catch(error => console.log(error))
    }, [id])
    return userData
}
export default useGetById