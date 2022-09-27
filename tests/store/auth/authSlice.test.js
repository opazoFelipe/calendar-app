import { authSlice, onLogin, onLogout, onClearErrorMessage } from "../../../src/store/auth/authSlice"

import { initialState, authenticatedState, notAuthenticatedState } from '../../__fixtures__/authStates'
import { testUserCredentials } from '../../__fixtures__/testUser'


describe('Pruebas en authSlice', () => {

    test('debe regresar el estado por defecto', () => {

        const state = authSlice.getInitialState()

        expect(state).toEqual(initialState)
    })

    test('debe realizar un login', () => {

        const state = authSlice.reducer(initialState, onLogin(testUserCredentials))

        const { status } = authenticatedState
        const user = testUserCredentials

        expect(state).toEqual({
            status,
            user,
            errorMessage: undefined
        })

    })

    test('debe realizar el logout', () => {

        const state = authSlice.reducer(authenticatedState, onLogout())

        const { status } = notAuthenticatedState
        const user = {}

        expect(state).toEqual({
            status,
            user,
            errorMessage: undefined
        })

    })

    test('debe realizar el logout con mensaje de error', () => {

        const errorMessage = 'Credenciales no válidas'

        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage))

        const { status } = notAuthenticatedState
        const user = {}

        expect(state).toEqual({
            status,
            user,
            errorMessage
        })

    })

    test('debe limpiar el mensaje de error', () => {

        const errorMessage = 'Credenciales no válidas'

        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage))

        const newState = authSlice.reducer(state, onClearErrorMessage())

        expect(newState.errorMessage).toBe(undefined)
    })

})