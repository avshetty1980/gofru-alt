import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Input, Button, Form } from 'antd';
import { NextPage } from 'next';
import React, { useState } from 'react'
import { Wrapper } from '../../components/Wrapper';
import LinkNext from "next/link"
import { useChangePasswordMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../../utils/toErrorMap';
import { withApollo } from "../../utils/withApollo";

//token props coming from getinitialprops
const ChangePassword: NextPage<{ token: string }> = ({ token }) => {

        const router = useRouter();

        const [
            changePassword,
            { loading: mutationLoading, error: mutationError },
        ] = useChangePasswordMutation()

        const [tokenError, setTokenError] = useState("")

        const onFinish = async (values) => {      
        console.log('Received values of form: ', values)
        const response = await changePassword({
            variables: {
                newPassword: values.newPassword,
                token,
            },          
        })

        
        if(response.data?.changePassword.errors) {
          //error needs to be shown to user 
          const errorMap =  toErrorMap(response.data.changePassword.errors)        
          console.log("Gql errors",toErrorMap(response.data.changePassword.errors))
          console.log("response error",response.data.changePassword.errors)  
          if("token" in errorMap){
            setTokenError(errorMap.token)
            } 
      
            } else if (response.data?.changePassword.user) {
          //worked
          console.log("worked")
          router.push("/")
            }

        }

    return (
            
        <Wrapper>
        <Form
            name="change-password"
            className="change-password-form"
            initialValues={{ newPassword: "" }}
            onFinish={onFinish}
            //validateMessages={validateMessages}            
        >
                       
            
            <Form.Item
                label="New Password"
                name="newPassword"                
                rules={[{
                    required: true,                    
                    message: 'Please input your new Password'
                     }]}
            >
            <Input 
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="New Password"
                type="password"
            />            
            </Form.Item>     

              { tokenError ? (
            <div>
             <div style={{ color: "red" }}>{tokenError}
             </div>
             <LinkNext href="/forgot-password">
             <a>Click here to get a new Password</a>
             </LinkNext>
             </div>
             ) : null}       

             <Form.Item>
                <Button
                     type="primary"
                     htmlType="submit"
                     className="login-form-button"                     
                >
                    Change Password
                </Button>
                Or 
                <LinkNext href="/register">
                <a >register now!</a>
                </LinkNext>
            </Form.Item>           
            {/* <div>
                token is: {token}
            </div> */}
              {mutationLoading && <p>Loading...</p>}
             {mutationError && <p>Error :( Please try again</p>} 
         </Form>
         </Wrapper> 
        )
}

//could use getServerProps instead to run on server
//takes any query parameter and passes to the component
ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string
    }
}

export default withApollo({ ssr: false }) (ChangePassword)
