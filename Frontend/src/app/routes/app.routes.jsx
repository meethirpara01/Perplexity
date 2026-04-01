import { createBrowserRouter, Navigate } from "react-router"
import Login from "../../features/auth/pages/Login"
import Register from "../../features/auth/pages/Register"
import Deshboard from "../../features/chat/pages/Deshboard"
import Protected from "../../features/auth/components/Protected"
import Verify from "../../features/auth/pages/Verify"

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/verify",
        element: <Verify />
    },
    {
        path: "/",
        element: <Protected>
            <Deshboard />
        </Protected>
    },
    {
        path: "/Deshboard",
        element: <Navigate to="/" />
    }
])