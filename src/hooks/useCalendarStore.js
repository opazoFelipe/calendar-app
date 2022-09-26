import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api"
import { convertEventsToDateEvents } from "../helpers"
import { onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent, onLoadEvents } from "../store"
import { showErrorAlert, showSuccessAlert } from '../alerts/showAlert'

export const useCalendarStore = () => {

    const dispatch = useDispatch()

    const { events, activeEvent } = useSelector(state => state.calendar)
    const { user } = useSelector(state => state.auth)

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent.id))
    }

    const startSavingEvent = async (calendarEvent) => {
        // TODO: Update Event

        try {
            // Actualizando
            if (calendarEvent.id) {
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent)
                dispatch(onUpdateEvent({ ...calendarEvent, user }))
                showSuccessAlert('Éxito', 'Eventos Actualizados')
                return
            }

            // Creando
            const { data } = await calendarApi.post('/events', calendarEvent)
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }))
            showSuccessAlert('Éxito', 'Eventos Actualizados')
        } catch (error) {
            console.log(error)
            showErrorAlert('Error al guardar', error.response.data?.msg)
            dispatch(onError())
        }
    }

    const startDeletingEvent = async () => {
        // TODO: llegar al backend
        try {
            await calendarApi.delete(`/events/${ activeEvent.id }`)
            dispatch(onDeleteEvent())
        } catch (error) {
            console.log(error)
            showErrorAlert('Error al eliminar', error.response?.data?.msg)
        }
    }

    const startLoadingEvents = async () => {
        try {

            const { data } = await calendarApi.get('/events')
            const events = convertEventsToDateEvents(data.eventos)

            console.log(events)
            dispatch(onLoadEvents(events))

        } catch (error) {
            console.log('Error cargando eventos')
            console.log(error)
        }
    }

    return {
        //* Propiedades
        events,
        activeEvent,

        // Si el objeto es null retorna falso, si es un objeto retorna true
        hasEventSelected: !!activeEvent,

        //* Metodos
        setActiveEvent,
        startDeletingEvent,
        startLoadingEvents,
        startSavingEvent,
    }
}

