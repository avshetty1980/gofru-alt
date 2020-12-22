import { useMeQuery } from "../generated/graphql"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const useIsAuth = () => {
    const { data, loading } = useMeQuery()
    const router = useRouter()
    //console.log(router)
    useEffect(() => {
        if(!loading && !data?.me) {
            //info to login page, where to navigate after login
            router.replace("/login?next=" + router.pathname)
        }
    },[loading, data, router])
}