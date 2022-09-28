import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsStates, events, initialState } from "../../__fixtures__/calendarStates"

describe('Pruebas en calendarSlice', () => {

    test('debe regresar el estado por defecto', () => {

        const state = calendarSlice.getInitialState()

        expect(state).toEqual(initialState)

    })

    test('onSetActiveEvent debe acitvar el evento', () => {

        const state = calendarSlice.reducer(calendarWithEventsStates, onSetActiveEvent(events[0].id))

        expect(state.activeEvent).toEqual(events[0])

    })

    test('onAddNewEvent debe agregar el evento', () => {

        const newEvent = {
            id: '3',
            start: '2020-02-03 13:00:00',
            end: '2020-02-03 15:00:00',
            title: 'Cumpleaños de Felipe',
            notes: 'Hay que comprar el mini hamburguesas en 2020'
        }

        const state = calendarSlice.reducer(calendarWithActiveEventState, onAddNewEvent(newEvent))

        expect(state.events).toEqual([
            ...events,
            newEvent
        ])

        expect(state.activeEvent).toBe(null)
    })

    test('onUpdateEvent debe actualizar el evento', () => {

        const updatedEvent = {
            id: '1',
            start: '2020-02-03 13:00:00',
            end: '2020-02-03 15:00:00',
            title: 'Cumpleaños de Felipe',
            notes: 'Hay que comprar el mini hamburguesas en 2020'
        }

        const state = calendarSlice.reducer(calendarWithActiveEventState, onUpdateEvent(updatedEvent))

        expect(state.events).toContain(updatedEvent)

    })

    test('onDeleteEvent debe borrar el evento activo', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent())

        expect(state.events).not.toContain(events[0])
        expect(state.activeEvent).toBe(null)

    })

    test('onLoadEvents debe establecer los eventos', () => {
        const state = calendarSlice.reducer(initialState, onLoadEvents(events))

        expect(state.isLoadingEvents).toBeFalsy()
        expect(state.events).toEqual(events)

    })

    test('onLoadEvents no debe establecer los eventos que ya estan establecidos', () => {
        const state = calendarSlice.reducer(calendarWithEventsStates, onLoadEvents(events))

        expect(state.events.length).toBe(events.length)

    })

    test('onLogoutCalendar debe limpiar el estado', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar())

        expect(state).toEqual(initialState)
    })
})