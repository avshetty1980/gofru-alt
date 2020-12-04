import React from 'react'
import {
  Form,
  Input,
  Button,
} from 'antd'
import { gql, useMutation } from '@apollo/client';

import { UserOutlined, LockOutlined, PoweroffOutlined } from '@ant-design/icons'
import { Wrapper } from '../components/Wrapper';

interface registerProps {

}

const REGISTER_MUT = gql`
mutation Register($email: String!, $username: String!, $password: String!) {
  register(
    options: {
      email: $email
      username: $username
      password: $password
    }) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  } 
}
`

const Register: React.FC<registerProps> = ({}) => {

    const [
        register,
        { loading: mutationLoading, error: mutationError },
    ] = useMutation(REGISTER_MUT)

    const [form] = Form.useForm()

    const onFinish = async (values) => {
        console.log('Received values of form: ', values)
        return await register({variables: {
            email: values.email,
            username: values.username,
            password: values.password
             } })
        
    };

 
    return (
        <Wrapper>
        <Form
            name="login"
            className="login-form"
            initialValues={{ email: "", username: "", password: "" }}
            onFinish={onFinish}
        >

            <Form.Item
                name="email"
                label="Email"
                rules={[{
                    required: true,
                    type: 'email',
                    message: "Please enter valid Email"
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
                    Register
                </Button>
                Or <a href="">register now!</a>
            </Form.Item>
           {mutationLoading && <p>Loading...</p>}
            {mutationError && <p>Error :( Please try again</p>} 
        </Form>
    </Wrapper>

    )
}



export default Register