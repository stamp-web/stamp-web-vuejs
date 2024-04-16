import type { SweetAlertResult } from 'sweetalert2'
import Swal from 'sweetalert2'

export interface AlertOptions {
  message: string
  title?: string
  confirmButtonLabel?: string
  asHtml?: boolean
}
export interface ConfirmationOptions extends AlertOptions {
  denyButtonLabel?: string
}
const customStylingForSweetAlerts = {
  container: '',
  popup: 'pb-2',
  header: '',
  title: '',
  closeButton: '',
  icon: '',
  image: '',
  htmlContainer: '!text-sm',
  input: '',
  inputLabel: '',
  validationMessage: '',
  actions: 'mt-2',
  confirmButton:
    'py-1 px-3 hover:cursor-pointer !text-sm ' +
    'bg-[var(--vf-bg-disabled)] text-[var(--vf-color-disabled)] ' +
    'rounded border border-[var(--vf-bg-disabled)] ' +
    'enabled:bg-[var(--vf-primary)] enabled:text-[var(--vf-color-on-primary)] ' +
    '!shadow-sm ' +
    'hover:enabled:bg-[var(--vf-primary-darker)]',
  denyButton:
    'py-1 px-3 hover:cursor-pointer !text-sm ' +
    'bg-[var(--vf-bg-disabled)] text-[var(--vf-color-disabled)] ' +
    'rounded border border-[var(--vf-bg-disabled)] ' +
    'enabled:border-[var(--vf-border-color-btn-secondary)] ' +
    'enabled:bg-[var(--vf-bg-btn-secondary)] enabled:text-[var(--vf-color-input)] ' +
    '!shadow-sm ' +
    'hover:enabled:bg-[var(--vf-bg-passive)] hover:enabled:border-[var(--vf-bg-btn-secondary)]',
  cancelButton: '',
  loader: '',
  footer: '',
  timerProgressBar: ''
}

class prompt {
  confirm(options: ConfirmationOptions): Promise<boolean> {
    const params = {
      title: options.title || '',
      customClass: customStylingForSweetAlerts,
      width: '25em',
      showDenyButton: true,
      confirmButtonText: options.confirmButtonLabel || 'Yes',
      denyButtonText: options.denyButtonLabel || 'No'
    }
    // @ts-ignore
    params[options.asHtml ? 'html' : 'text'] = options.message
    return Swal.fire(params).then((result: SweetAlertResult) => {
      return Promise.resolve(result.isConfirmed)
    })
  }

  alert(options: AlertOptions): Promise<void> {
    const params = {
      title: options.title || '',
      customClass: customStylingForSweetAlerts,
      width: '25em',
      showDenyButton: false,
      confirmButtonText: options.confirmButtonLabel || 'Ok'
    }
    // @ts-ignore
    params[options.asHtml ? 'html' : 'text'] = options.message
    return Swal.fire(params).then(() => {
      return Promise.resolve()
    })
  }
}

export const Prompt = new prompt()
