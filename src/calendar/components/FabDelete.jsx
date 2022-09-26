import { useCalendarStore, useUiStore } from "../../hooks"
export const FabDelete = () => {

    const { startDeletingEvent, hasEventSelected } = useCalendarStore()
    const { isDateModalOpen } = useUiStore()

    const handleDelete = () => {
        startDeletingEvent()
    }

    const showingButton = () => {
        if ( hasEventSelected && !isDateModalOpen ) return true

        return false
    }

    return (
        <button
            onClick={() => handleDelete()}
            className="btn btn-danger fab-danger"
            style={{
                display: ( showingButton() ) ? '' : 'none'
            }}
        >
            <i className="fas fa-trash-alt"></i>

        </button>
    )
}


