export const events = [
    {
        id: '1',
        start: '2022-02-03 13:00:00',
        end: '2022-02-03 15:00:00',
        title: 'Cumpleaños de Felipe',
        notes: 'Hay que comprar el mini hamburguesas'
    },
    {
        id: '2',
        start: '2022-07-05 13:00:00',
        end: '2022-07-05 15:00:00',
        title: 'Cumpleaños de PePinguine',
        notes: 'Hay que comprar un regalo muy caro y aparentador'
    },
]

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsStates = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] }
}