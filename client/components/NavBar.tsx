import React from "react";
import { Breadcrumb, Button } from "antd";
import LinkNext from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
//import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  // const router = useRouter();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  
  //do not run on Next.js server as logged in user not required for SEO
  //can check if on server if window variable is defined
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;

  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <LinkNext href="/login">
          <a>login</a>
        </LinkNext>
        <LinkNext href="/register">
          <a>register</a>
        </LinkNext>
      </>
    );
    // user is logged in
  } else {
    body = (
      <div >
        {/* <LinkNext href="/create-post">
          <Button type="link">
            create post
          </Button>
        </LinkNext> */}
        <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>{data.me.username}</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          loading={logoutFetching}
          type="link"
        >
          logout
        </Button>
      </div>
    );
  }

  return (
      <>    
        <LinkNext href="/">
          <a>
            <h1>Gofru-alt</h1>
          </a>
        </LinkNext>
        <div >{body}</div>
    </>
      
  );
};