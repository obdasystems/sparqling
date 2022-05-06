const limit = document.createElement('div')
const label = document.createElement('label')
const input = document.createElement('input')

label.innerHTML = 'N. of results'
input.type = 'number'
input.classList.add('input-elem')
input.id = 'limit-input'
input.min = '0'
input.disabled = true


limit.appendChild(label)
limit.appendChild(input)

export default limit
