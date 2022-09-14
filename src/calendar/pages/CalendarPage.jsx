import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { addHours } from 'date-fns'
import { NavBar, CalendarEvent, CalendarModal } from "../"
import { localizer, getMessagesEs } from '../../helpers'
import { useState } from 'react'

import { useUiStore } from '../../hooks'

const events = [{
    title: 'Cumpleaños del Jefe',
    notes: 'Hay que comprar el pastel',
    start: new Date(),
    end: addHours(new Date(), 2),
    bgColor: '#fafafa',
    user: {
        _id: '123',
        name: 'Fernando',
    },
}]

export const CalendarPage = () => {

    const { openDateModal } = useUiStore()

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week' )

    const eventStyleGetter = (event, start, end, isSelected) => ({
        backgroundColor: '#347CF7',
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
    })

    const onDoubleClick = (event) => {
        openDateModal()
    }

    const onSelect = (event) => {
        console.log({ click: event })
    }

    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event)
    }

    return (
        <>
            <NavBar />

            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc( 100vh - 80px)' }}
                messages={getMessagesEs()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />

            <CalendarModal />
        </>
    )
}
