import { createSlice } from '@reduxjs/toolkit';
import { addHours } from 'date-fns';

// const tempEvent = {
//     _id: new Date().getTime(),
//     title: 'Cumpleaños del Jefe',
//     notes: 'Hay que comprar el pastel',
//     start: new Date(),
//     end: addHours(new Date(), 2),
//     bgColor: '#fafafa',
//     user: {
//         _id: '123',
//         name: 'Fernando',
//     }
// }

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        isLoadingEvents: true,
        events: [],
        activeEvent: null
    },
    reducers: {
        // dentro del action viene el payload (action.payload)
        onBeforeAddNewEvent: (state) => {
            state.activeEvent = null
        },
        onSetActiveEvent: (state, { payload }) => {
            state.activeEvent = state.events.find(event => event.id === payload)
        },
        onAddNewEvent: (state, { payload }) => {
            state.events.push(payload)
            state.activeEvent = null
        },
        onUpdateEvent: (state, { payload }) => {
            state.events = state.events.map(event => {
                if (event.id === payload.id) {
                    return payload
                }

                return event
            })
        },
        onDeleteEvent: (state) => {
            if (state.activeEvent) {
                state.events = state.events.filter(event => event.id !== state.activeEvent.id);
                state.activeEvent = null;
            }
        },
        onLoadEvents: (state, { payload = [] }) => {
            state.isLoadingEvents = false
            // state.events = payload
            payload.forEach(event => {
                const exists = state.events.some(dbEvent => dbEvent.id === event.id)

                if (!exists) {
                    state.events.push(event)
                }
            })
        },
        onLogoutCalendar: (state) => {
            state.isLoadingEvents = false
            state.events = []
            state.activeEvent = null
        },
    }
});


// Action creators are generated for each case reducer function
export const { onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onBeforeAddNewEvent } = calendarSlice.actions;
