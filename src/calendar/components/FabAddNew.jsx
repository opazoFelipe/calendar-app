import { addHours } from "date-fns"
import { useDispatch } from "react-redux"
import { useCalendarStore, useUiStore } from "../../hooks"
import { onPreviousCreateNewEvent } from "../../store"

export const FabAddNew = () => {

    const { setActiveEvent } = useCalendarStore()
    const { openDateModal } = useUiStore()

    const dispatch = useDispatch()

    const handleClickNew = () => {
        dispatch( onPreviousCreateNewEvent() )
        openDateModal()
    }

    return (
        <button
            onClick={() => handleClickNew()}
            className="btn btn-primary fab"
        >
            <i className="fas fa-plus"></i>

        </button>
    )
}
