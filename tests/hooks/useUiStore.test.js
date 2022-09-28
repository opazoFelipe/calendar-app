import { configureStore } from "@reduxjs/toolkit"
import { renderHook } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { Provider } from "react-redux"
import { useUiStore } from '../../src/hooks/useUiStore'
import { store, uiSlice } from "../../src/store"

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
}

// En este caso no se haran mocks del dispatch pues es una alternativa diferente para este tipo de testing

// Se hara un mock al store y se testeara que los valores del store hayan cambiado segun las acciones llamadas 

// Se renderizaran los hooks (renderHook()) y se les pasara el store de la App a traves del provider para que funcionen

describe('Pruebas en useUiStore', () => {

    test('debe regresar los valores por defecto', () => {

        const mockStore = getMockStore({ isDateModalOpen: false })

        const { result } = renderHook(() => useUiStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function)
        })
    })

    test('openDateModal debe colocar true en isDateModalOpen', () => {

        const mockStore = getMockStore({ isDateModalOpen: false })

        const { result } = renderHook(() => useUiStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        // El isDateModalOpen es un primitivo, por lo tanto su valor al desestructurarlo se mantiene constante, el openDateModal() no cambiarara su valor a true, la actualizacion se debe tomar del result.current.isDateModalOpen pues ahi si se puede ver el resultado actualizado. Esto pasa al extraer primitivos que su valor no se actualiza pero los objetos si se actualizan
        const { isDateModalOpen, openDateModal } = result.current
        
        act( () => {
            openDateModal()
        })
        
        expect(result.current.isDateModalOpen).toBeTruthy()

    })

    test('closeDateModal debe colocar false en isDateModalOpen', () => {

        const mockStore = getMockStore({ isDateModalOpen: true })

        const { result } = renderHook(() => useUiStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        const { closeDateModal } = result.current
        
        act( () => {
            closeDateModal()
        })
        
        expect(result.current.isDateModalOpen).toBeFalsy()

    })

    test('toggleDateModal debe cambiar el estado respectivamente', () => {

        const mockStore = getMockStore({ isDateModalOpen: true })

        const { result } = renderHook(() => useUiStore(), {
            // El wrapper se dispara con una funcion que tiene como argumento un jsx
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        })

        act( () => {
            result.current.toggleDateModal()
        })

        expect(result.current.isDateModalOpen).toBeFalsy()

        act( () => {
            result.current.toggleDateModal()
        })

        expect(result.current.isDateModalOpen).toBeTruthy()

    })


})