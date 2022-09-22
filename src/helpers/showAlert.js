import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export const showSuccessAlert = ( title, message ) => {
    if (! title || !message ) return 

    Swal.fire(title, message, 'success')
}

export const showErrorAlert = ( title, message ) => {
    if (! title || !message ) return 

    Swal.fire(title, message, 'error')
}