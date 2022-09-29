import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { renderHook, waitFor } from '@testing-library/react'

import { act } from 'react-dom/test-utils'
import { calendarApi } from '../../src/api'
import { useAuthStore } from '../../src/hooks/useAuthStore'
import { authSlice } from '../../src/store/auth/authSlice'
import { initialState, notAuthenticatedState } from '../__fixtures__/authStates'
import { testUserCredentials } from '../__fixtures__/testUser'

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}

describe('pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear())

    test('debe regresar los valores por defecto', () => {
        const mockStore = getMockStore({ ...initialState })

        const { result } = renderHook(() => useAuthStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        })

    })

    // Aqui se realizan las pruebas para un metodo del hook que es asincrono
    test('startLogin debe realizar el login correctamente', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState })

        const { result } = renderHook(() => useAuthStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async () => {
            await result.current.startLogin(testUserCredentials)
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            status: 'authenticated',
            user: {
                name: testUserCredentials.name,
                uid: expect.any(String)
            },
            errorMessage: undefined
        })

        expect(localStorage.getItem('token')).toEqual(expect.any(String))
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))

    })

    test('startLogin debe fallar la autenticacion', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState })

        const { result } = renderHook(() => useAuthStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async () => {
            await result.current.startLogin({ email: 'algo@google.com', password: '123456789' })
        })

        const { errorMessage, status, user } = result.current

        expect(localStorage.getItem('token')).toBe(null)

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {}
        })

        // Para el dispatch(onClearErrorMessage()) el cual se ejecuta con timeOut de 10 segundos
        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        )
    })

    test('startRegister debe crear un usuario', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState })

        const { result } = renderHook(() => useAuthStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        const espia = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "123456789",
                name: "Test User",
                token: "ALGUN-TOKEN"
            }
        })

        await act(async () => {
            await result.current.startRegister({ ...testUserCredentials, password: '123456789' })
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '123456789' }
        })

        // Esta funcion (siempre se debe llamar) limpia el espia para que no afecte a otras pruebas ya que basta que en una prueba se cree el espia y afecta a todas las pruebas donde el espia se este usando
        espia.mockRestore()
    })

    test('startRegister debe crear un usuario', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState })

        const { result } = renderHook(() => useAuthStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async () => {
            await result.current.startRegister(testUserCredentials)
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {}
        })
    })

    test('checkAuthToken debe fallar si no hay un token', async () => {
        const mockStore = getMockStore({ ...initialState })

        const { result } = renderHook(() => useAuthStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async () => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        })
    })

    test('checkAuthToken debe autenticar el usuario si hay un token', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials)
        localStorage.setItem('token', data.token)

        const mockStore = getMockStore({ ...initialState })

        const { result } = renderHook(() => useAuthStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async () => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: testUserCredentials.name,
                uid: expect.any(String)
            }
        })
    })

    test('checkAuthToken debe fallar la autenticacion si el token expiro', async () => {
        // Como no se puede simular que haya expirado el token se creara un token no valido
        localStorage.setItem('token', '123456789')

        const mockStore = getMockStore({ ...initialState })

        const { result } = renderHook(() => useAuthStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        await act(async () => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        })

        expect(localStorage.getItem('token')).toBe(null)
    })


})