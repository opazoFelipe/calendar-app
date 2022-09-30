import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { addHours } from 'date-fns/esm';

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import es from 'date-fns/locale/es';
import { differenceInSeconds } from 'date-fns';

import { useCalendarStore, useUiStore } from '../../hooks';

import { showErrorAlert } from '../../alerts/showAlert';
import { getEnvVariables } from '../../helpers';

registerLocale('es', es)

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

// Se obtiene desde el archivo index.html del root del proyecto (<div id="root"></div>)

/**
 * La linea de la condición de las variables de entorno (getEnvVariables().VITE_MODE !== 'test') es para que este componente no de error en el testing del AppRouter o del mismo componente
 * 
 */
if (getEnvVariables().VITE_MODE !== 'test') {
    Modal.setAppElement('#root');
}

export const CalendarModal = () => {

    const { activeEvent, startSavingEvent } = useCalendarStore()
    const { isDateModalOpen, closeDateModal } = useUiStore()

    const [formSubmitted, setFormSubmitted] = useState(false)

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2)
    })

    const titleClass = useMemo(() => {
        if (!formSubmitted) return ''

        return (formValues.title.length > 0)
            ? 'is-valid'
            : 'is-invalid'

    }, [formValues.title, formSubmitted])

    useEffect(() => {
        if ( activeEvent !== null) {
            setFormValues({ ...activeEvent })
        } else {
            setFormValues({
                title: '',
                notes: '',
                start: new Date(),
                end: addHours(new Date(), 2)
            })
        }
    }, [activeEvent])


    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onDateChanged = (event, changing = 'start') => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    const onCloseModal = () => {
        closeDateModal()
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        setFormSubmitted(true)

        const difference = differenceInSeconds(formValues.end, formValues.start)

        if (isNaN(difference) || difference <= 0) {
            showErrorAlert('Fechas incorrectas', 'Revisar las fechas ingresadas')
            return
        }

        if (formValues.title.length <= 0) return

        // TODO: llegar al backend 
        await startSavingEvent( formValues )
        closeDateModal()
        setFormSubmitted(false)
    }

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={onCloseModal}
            style={customStyles}
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form
                onSubmit={onSubmit}
                className="container"
            >

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    <DatePicker
                        showTimeSelect={true}
                        selected={formValues.start}
                        onChange={(event) => onDateChanged(event, 'start')}
                        className="form-control"
                        dateFormat="Pp"
                        locale="es"
                        timeCaption="Hora"
                    />
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    <DatePicker
                        showTimeSelect={true}
                        minDate={formValues.start}
                        selected={formValues.end}
                        onChange={(event) => onDateChanged(event, 'end')}
                        className="form-control"
                        dateFormat="Pp"
                        locale="es"
                        timeCaption="Hora"
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${titleClass}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChanged}
                    // required
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChanged}
                    // required
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
