import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth"
import { CalendarPage } from "../calendar"
import { useAuthStore } from "../hooks"

export const AppRouter = () => {
    // const authStatus = 'not-authenticated'

    const { status, checkAuthToken } = useAuthStore()

    useEffect(() => {
        checkAuthToken()
    }, [])

    return (
        <>
            <Routes>
                {
                    (status === 'not-authenticated')
                        ? (
                            <>
                                <Route path="/auth/*" element={<LoginPage />} />
                                <Route path="/*" element={<Navigate to="/auth/login" />} />
                            </>
                        )
                        : (
                            <>
                                {/* El path = "/" indica el root del host, es decir solo el nombre del host en el navegador */}
                                <Route path="/" element={<CalendarPage />} />

                                {/* Cualquier ruta que no sea "/" estando logeado va a redirigir hacia el root del host, es decir al CalendarPage como se definicio anteriormente */}
                                <Route path="/*" element={<Navigate to="/" />} />
                            </>
                        )
                }

            </Routes>
        </>
    )
}
