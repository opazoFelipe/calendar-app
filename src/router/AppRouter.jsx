import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth"
import { CalendarPage } from "../calendar"

export const AppRouter = () => {
    const authStatus = 'not-authenticated'

    return (
        <>
            <Routes>
                {
                    (authStatus === 'authenticated')
                        ? <Route path="/auth/*" element={<LoginPage />} />
                        : <Route path="/calendar/*" element={<CalendarPage />} />
                }

                {/* Redireccionamiento cuando se llaman rutas que no existen, esta ruta solo existe cuando el usuario no esta autenticado */}
                <Route path="/*" element={<Navigate to="/auth/login" />} />
            </Routes>
        </>
    )
}
