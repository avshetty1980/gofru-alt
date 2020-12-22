import { UserOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input } from 'antd';
import { withApollo } from "../utils/withApollo";
import React from 'react'
import { useCreateProfileMutation } from "../generated/graphql"
import { useRouter } from "next/router"
import { LayoutTemplate } from '../components/LayoutTemplate';
import { useIsAuth } from '../utils/useIsAuth';


const CreateProfile: React.FC<{}> = ({}) => {

    const router = useRouter()

    useIsAuth()

    const [ createProfile,
            { loading: mutationLoading, error: mutationError },
         ] = useCreateProfileMutation()

    const onFinish = async (fieldsValue) => {   
         const values = {
            ...fieldsValue,
            "dob": fieldsValue["dob"].format('DD-MM-YYYY'), 
        }  

        console.log('Received values of form: ', values)

        const errors= await createProfile({
            variables: {input : values},            
        })
        
        if(!errors){
        router.push("/")
        }
       
    }

    return (
        <LayoutTemplate>
            <Form
                name="createProfile"
                className="createProfile-form"
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
                    name="firstname"
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
                    name="lastname"
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
                <DatePicker />
                </Form.Item>

                <Form.Item>
                 <Button
                     type="primary"
                     htmlType="submit"
                     className="createProfile-form-button"
                     
                >
                    Create Profile
                </Button>
                
                </Form.Item>
                {mutationLoading && <p>Loading...</p>}
             {mutationError && <p>Error :( Please try again</p>} 
            </Form>

        </LayoutTemplate>
    );
}

export default withApollo({ ssr: true }) (CreateProfile)