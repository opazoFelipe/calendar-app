import { render, screen } from "@testing-library/react"
import { AppRouter } from "../../src/router/AppRouter"
import { useAuthStore } from '../../src/hooks/useAuthStore'
import { MemoryRouter } from "react-router-dom"
import { CalendarPage } from '../../src/calendar/pages/CalendarPage'

jest.mock('../../src/hooks/useAuthStore')

jest.mock('../../src/calendar/pages/CalendarPage', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}))

describe('Pruebas en <AppRouter />', () => {

    const mockCheckAuthToken = jest.fn()

    beforeEach(() => jest.clearAllMocks())


    /** Esta prueba da el siguiente error:
     * 
     * Modal.setAppElement('#root');
     * 
     * Este error es debido a que hay un plugin que está llamando al elemento '#root' del App pero en el testing dicho elemento no existe 
     * 
     * La solución al problema es la siguiente:
     * 
     * En el Component que da el error (en este caso <CalendarModal />) en la linea donde se llama el '#root' agregar una condición de que esa instrucción solo se llame cuando el env_mode sea distinta de test:
     * 
     * if (getEnvVariables().VITE_MODE !== 'test') { Modal.setAppElement('#root')}
     * 
     * El componente en testing igual seguira funcionando aunque no tenga esa instrucción
     * 
     * 
     * Tambien puede existir un error producto de que dentro del AppRouter esta el LoginPage el cuál importa su css.
     * 
     * La solución a esto esta en escribir la siguiente instrucción en el jest.config.cjs
     * 
     * 
     * moduleNameMapper: { '\\.(css|less)$': '<rootDir>/tests/mocks/styleMock.js',},
     */

    test('debe mostrar la pantalla de cargar y llamar checkAuthToken', () => {

        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        })

        render(<AppRouter />)

        expect(screen.getByText('Cargando...')).toBeTruthy()

        expect(mockCheckAuthToken).toHaveBeenCalled()

    })

    test('debe mostrar el login en caso de no estar autenticado', () => {

        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        })

        const { container } = render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        )

        expect(screen.getByText('Ingreso')).toBeTruthy()
        expect(container).toMatchSnapshot()

    })

    /**
     * Lo unico importante en esta prueba es saber si el CalendarPage se ha renderizado
     * 
     * No es necesario hacer los mocks de los hooks que existen dentro del CalendarPage
     * 
     * La solución seria hacer un mock del Funcional Component y hacer que devuelva algo sencillo como un h1 con un texto
     */
    test('debe mostrar el calendario si estamos autenticados', () => {

        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        })

        render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        )

        expect( screen.getByText('CalendarPage')).toBeTruthy()

    })

})