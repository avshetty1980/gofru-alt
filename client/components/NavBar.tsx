import React from 'react'
import { useApolloClient } from "@apollo/client"
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { Button } from 'antd';


interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {

    const [logout, { loading: logoutFetching }] = useLogoutMutation()
    const apolloClient = useApolloClient()
    const { data, loading} = useMeQuery()

    let body = null

    //data is loading
    if (loading) {
        body = null
        //user not logged in
    } else if(!data?.me) {
        body = (
        <>
        <NextLink href="/login">
            <a>Login</a>
        </ NextLink>

        <NextLink href="/register">
            <a>Register</a>
        </NextLink>
        </>
        )
        //user is logged in
    } else {
        body = (
        <div>
        <div>Current user is: {data.me.username}</div>
        <Button onClick={async () => {
            await logout()
            await apolloClient.resetStore()
            }} 
            type="link"
            loading={logoutFetching}
        >
            Log Out
        </Button>

        </div>
        )
    }
        return (
            <div className="navbar">
                
                {body} Navbar
            </div>
        );
}