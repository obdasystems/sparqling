export default function (form: HTMLFormElement): boolean {

  const inputs = form.querySelectorAll('input')
  const selects = form.querySelectorAll('select')
  let isValid = true

  inputs?.forEach(input => {
    isValid = isValid && validateInputElement(input)
  })

  selects?.forEach(select => {
    isValid = isValid && validateSelectElement(select)
  })

  return isValid
}


export function validateInputElement(input: HTMLInputElement) {
  const validityState = input.validity

  if (validityState.valueMissing) {
    input.setCustomValidity('Please fill out this field.')
  } else if (validityState.rangeUnderflow) {
    input.setCustomValidity(`Please select a number that is no lower than ${input.min}`)
  } else if (validityState.rangeOverflow) {
    input.setCustomValidity(`Please select a number that is no greater than ${input.max}`)
  } else if (validityState.typeMismatch) {
    input.setCustomValidity(`Please select a ${input.type}`)
  } else {
    input.setCustomValidity('')
  }

  return input.reportValidity()
}

export function validateSelectElement(select: HTMLSelectElement) {
  if (!select.checkValidity()) {
    select.setCustomValidity('Please select an item in the list.')
  }

  const returnValue = select.reportValidity()
  // reset message, otherwise checkValidity returns always false at next validations
  select.setCustomValidity('')
  return returnValue
}