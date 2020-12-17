import { LockOutlined} from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react'
import { Wrapper } from '../components/Wrapper';
import { withApollo } from "../utils/withApollo"
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: React.FC<{}> = ({}) => {

    const [complete, setComplete] = useState(false)

    const [forgotPassword] = useForgotPasswordMutation()

        const onFinish = async (values) => {      
        console.log('Received values of form: ', values)
        await forgotPassword({ variables: values })
        setComplete(true)
        }
         
        return (
           
        <Wrapper>        
        <div>
            {complete ?
         <div>
             If an account with that email exists, we sent you an email
             </div> : (
        <Form
            name="login"
            className="login-form"
            initialValues={{ email: "" }}
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
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="email"
                placeholder="Email"
            />
            </Form.Item>

            <Form.Item>
                <Button
                     type="primary"
                     htmlType="submit"
                     className="login-form-button"
                     
                >
                    Forgot Password
                </Button>               
            </Form.Item>
           {/* {mutationLoading && <p>I am Loading...!!!!!</p>}
            {mutationError && <p>Error :( Please try again</p>}  */}
                
        </Form>
        )}
        </div>
    </Wrapper>
    
    
        );
}

export default withApollo({ ssr: false }) (ForgotPassword)