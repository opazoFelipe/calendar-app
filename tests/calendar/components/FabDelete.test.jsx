import { render, screen } from "@testing-library/react"

import { FabDelete } from "../../../src/calendar/components/FabDelete"


describe('Pruebas en <FabDelete />', () => {

    test('debe mostrar el componente correctamente', () => {
        render(<FabDelete />)

        screen.debug()



    })


})