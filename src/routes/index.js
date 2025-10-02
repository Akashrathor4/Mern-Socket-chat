import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import {RegisteredUser} from "../pages/RegisteredUser"
import {CheckEmailPage} from "../pages/CheckEmailPage"
import {CheckPasswordPage} from "../pages/CheckPasswordPage"
import {Home} from "../pages/Home"
import {MessagePage} from "../components/MessagePage"
import { AuthLayout } from "../layout";
import { ForgetPassword } from "../pages/ForgetPassword";
export const router = createBrowserRouter([
    {
        path:'/',
        element : <App/>,
        children:[
            {
                path : "register",
                element : <AuthLayout> <RegisteredUser/> </AuthLayout>
            },
            {
                path : 'email',
                element : <AuthLayout><CheckEmailPage/></AuthLayout>
            },
            {
                path : 'password',
                element : <AuthLayout><CheckPasswordPage/></AuthLayout>
            },
            {
                path : 'forget-password',
                element : <AuthLayout><ForgetPassword/></AuthLayout>
            },
            {
                path : '',
                element : <Home/>,
                children : [
                    {
                        path : ':userId',
                        element : <MessagePage/>
                    }
                ]
            }
        ]
    }
])