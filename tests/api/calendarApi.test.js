import calendarApi from '../../src/api/calendarApi'


describe('Pruebas en CalendarApi', () => {

    test('debe tener la configuracion por defecto', () => {

        expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL)

    })

    test('debe tener el x-token en el header de todas las peticiones', async () => {

        // NO se busca probar que el JWT sea valido, solo se busca probar que el localStorage tenga una variable con un valor para el JWT

        const token = 'ABC-123-XYZ'

        localStorage.setItem('token', token)
        const res = await calendarApi.get('/auth')

        expect (res.config.headers['x-token']).toBe( token )

    })

})


