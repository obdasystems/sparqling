import { handleOffsetChange } from "../handlers/extra-handlers"

const offsetInput = document.createElement('input')

offsetInput.placeholder = 'Offset'
offsetInput.type = 'number'
offsetInput.id = 'offset-input'
offsetInput.min = '1'
offsetInput.disabled = true

offsetInput.onchange = handleOffsetChange
offsetInput.addEventListener('focusout', handleOffsetChange)
offsetInput.onsubmit = handleOffsetChange

export default offsetInput
