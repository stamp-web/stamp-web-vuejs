import type {SweetAlertResult} from 'sweetalert2'
import Swal from "sweetalert2";

export interface AlertOptions {
    message: string
    title?: string
    confirmButtonLabel?: string
}
export interface ConfirmationOptions extends AlertOptions {
    denyButtonLabel?: string
}



class prompt {
    confirm(options: ConfirmationOptions): Promise<boolean> {
        return Swal.fire({
            text: options.message,
            title: options.title || '',
            showDenyButton: true,
            confirmButtonText: options.confirmButtonLabel || 'Yes',
            denyButtonText: options.denyButtonLabel || 'No'
        }).then((result) => {
            return Promise.resolve(result.isConfirmed);
        })
    }

    alert(options: AlertOptions): Promise<void> {
        return Swal.fire({
                text: options.message,
                title: options.title || '',
                showDenyButton: false,
                confirmButtonText: options.confirmButtonLabel || 'Yes',
            }).then((result) => {
                return Promise.resolve();
            })
    }
}

export const Prompt = new prompt();
