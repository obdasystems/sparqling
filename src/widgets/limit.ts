import { handleLimitChange } from "../handlers/extra-handlers"

const limitInput = document.createElement('input')

limitInput.placeholder = 'Num. of results'
limitInput.type = 'number'
limitInput.id = 'limit-input'
limitInput.min = '1'
limitInput.disabled = true

limitInput.onchange = handleLimitChange
limitInput.addEventListener('focusout', handleLimitChange)
limitInput.onsubmit = handleLimitChange

export default limitInput
