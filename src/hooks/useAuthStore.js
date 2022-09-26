import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api"
import { onChecking, onLogin, onLogout, onClearErrorMessage, onLogoutCalendar } from '../store'

/**
 * Aqui se despachan los reducer del store del auth 
 * Esta es una manera alternativa a usar los thunks, pero el proposito es el mismo
 * 
 */

const guardarToken = (token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('token-init-date', new Date().getTime())
}

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    // Proceso de login, accion asincrona
    const startLogin = async ({ email, password }) => {
        console.log('starting login')
        dispatch(onChecking())

        try {
            const { data } = await calendarApi.post('/auth', { email, password })
            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime())

            dispatch(onLogin({ name: data.name, uid: data.uid }))

        } catch (error) {
            dispatch(onLogout('Credenciales Incorrectas'))
            setTimeout(() => {
                dispatch(onClearErrorMessage())
            }, 10);
        }
    }

    // Proceso de registro, accion asincrona
    const startRegister = async ({ email, password, name }) => {
        dispatch(onChecking())

        try {
            const { data } = await calendarApi.post('/auth/new', { email, password, name })
            guardarToken(data.token)
            dispatch(onLogin({ name: data.name, uid: data.uid }))

        } catch (error) {
            dispatch(onLogout(error.response.data?.msg || 'No es posible realizar el registro'))
            setTimeout(() => {
                dispatch(onClearErrorMessage())
            }, 10);
        }
    }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token')

        if (!token) return dispatch(onLogout())

        try {
            const { data } = await calendarApi.get('/auth/renew')
            guardarToken(data.token)
            dispatch(onLogin({ name: data.name, uid: data.uid }))
        } catch (error) {
            localStorage.clear()
            dispatch(onLogout())
        }
    }

    const startLogout = () => {
        localStorage.clear()
        dispatch(onLogoutCalendar())
        dispatch(onLogout())
    }

    return {
        //* Propiedades
        status,
        user,
        errorMessage,

        //* Metodos
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    }
}