const offset = document.createElement('div')
const label = document.createElement('label')
const input = document.createElement('input')

label.innerHTML = 'Offset'
input.type = 'number'
input.classList.add('input-elem')
input.id = 'offset-input'
input.min = '1'
input.disabled = true


offset.appendChild(label)
offset.appendChild(input)

export default offset
