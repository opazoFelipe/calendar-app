import { useDispatch } from "react-redux"
import { useUiStore } from "../../hooks"
import { onBeforeAddNewEvent } from "../../store"

export const FabAddNew = () => {

    const { openDateModal } = useUiStore()
    const dispatch = useDispatch()

    const handleClickNew = () => {
        dispatch(onBeforeAddNewEvent())
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
