/*
Old version con sweerAlert
*/

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



/*
import { toast } from 'react-hot-toast'

export const showSuccessAlert = (title = '', message) => {
    if (!message) return

    toast.success(message)
}

export const showErrorAlert = (title = '', message) => {
    if (!message) return

    toast.error(message, {
        icon: '👏',
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff'
        },
    })
}
*/