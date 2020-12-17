import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { withApollo } from "../utils/withApollo";
import React from 'react'
import { Wrapper } from '../components/Wrapper';


const CreateProfile: React.FC<{}> = ({}) => {

    const onFinish = async (values) => {      
        console.log('Received values of form: ', values)
       
    }

        return (
            <Wrapper>
                 <Form
            name="login"
            className="login-form"
            initialValues={{
                title: "",
                firstname: "",
                lastname: "",
                dob: ""
             }}
            onFinish={onFinish}
            //validateMessages={validateMessages}            
        >
            <Form.Item
                label="Title"
                name="title"
                rules={[{
                    required: true,                    
                    message: 'Please input your Title!'
                     }]}
            >
            <Input 
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Title"
            />
            </Form.Item> 

            <Form.Item
                label="First Name"
                name="firstName"
                rules={[{
                    required: true,                    
                    message: 'Please input your first name!'
                     }]}
            >
            <Input 
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="First Name"
            />
            </Form.Item>  

            <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{
                    required: true,                    
                    message: 'Please input your last name!'
                     }]}
            >
            <Input 
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Last Name"
            />
            </Form.Item>          

            <Form.Item
                label="Date Of Birth"
                name="dob"
                rules={[{
                    required: true,
                    message: 'Please input your date of birth!'
                    }]}
            >
            <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                
                placeholder="Date of Birth"
            />
            </Form.Item>

            <Form.Item>
                <Button
                     type="primary"
                     htmlType="submit"
                     className="login-form-button"
                     
                >
                    Create Profile
                </Button>
                
            </Form.Item>
        </Form>

            </Wrapper>
        );
}

export default withApollo({ ssr: false}) (CreateProfile)