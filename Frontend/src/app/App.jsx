import { RouterProvider } from "react-router"
import { router } from "./routes/app.routes"
import { useAuth } from "../features/auth/hook/useAuth"
import { ThemeProvider } from "../features/chat/hook/ThemeProvider"
import { useEffect } from "react"

const App = () => {

  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App