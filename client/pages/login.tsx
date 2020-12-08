import React from 'react'
import {
  Form,
  Input,
  Button,
} from 'antd'
import LinkNext from "next/link"

import { UserOutlined, LockOutlined, PoweroffOutlined } from '@ant-design/icons'
import { Wrapper } from '../components/Wrapper';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router"
import { withApollo } from "../utils/withApollo"

interface loginProps {

}

const Login: React.FC<{}> = ({}) => {
    const router = useRouter()
    const [
        login,
        { loading: mutationLoading, error: mutationError },
    ] = useLoginMutation()


    const onFinish = async (values) => {      
        console.log('Received values of form: ', values)
        const response = await login({
            variables: { options: values},
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              })
            }
        })

        
        if(response.data?.login.errors) {
          //error needs to be shown to user          
          console.log("Gql errors",toErrorMap(response.data.login.errors))
          console.log("response error",response.data.login.errors)    
      
        } else if (response.data?.login.user) {
          //worked
          console.log("worked")
          router.push("/")
        }

    };

 
    return (
        <Wrapper>
        <Form
            name="login"
            className="login-form"
            initialValues={{ username: "", password: "" }}
            onFinish={onFinish}
            //validateMessages={validateMessages}            
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{
                    required: true,                    
                    message: 'Please input your Email!'
                     }]}
            >
            <Input 
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
            />
            </Form.Item> 

            <Form.Item
                label="Username"
                name="username"
                rules={[{
                    required: true,                    
                    message: 'Please input your Username!'
                     }]}
            >
            <Input 
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
            />
            </Form.Item>            

            <Form.Item
                label="Password"
                name="password"
                rules={[{
                    required: true,
                    message: 'Please input your Password!'
                    }]}
            >
            <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
            />
            </Form.Item>

            <Form.Item>
                <Button
                     type="primary"
                     htmlType="submit"
                     className="login-form-button"
                     
                >
                    Login
                </Button>
                Or 
                <LinkNext href="/register">
                <a >register now!</a>
                </LinkNext>
            </Form.Item>
           {mutationLoading && <p>I am Loading...!!!!!</p>}
            {mutationError && <p>Error :( Please try again</p>} 
        </Form>
    </Wrapper>

    )
}

export default withApollo({ ssr: false }) (Login)