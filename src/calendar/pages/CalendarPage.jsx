import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { NavBar, CalendarEvent, CalendarModal, FabAddNew } from "../"
import { localizer, getMessagesEs } from '../../helpers'
import { useState } from 'react'

import { useCalendarStore, useUiStore } from '../../hooks'

export const CalendarPage = () => {

    const { events, setActiveEvent } = useCalendarStore()
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
        setActiveEvent(event)
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
            <FabAddNew />
        </>
    )
}
