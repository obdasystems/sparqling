import { ui } from "grapholscape"
import { handleDistinctChange } from "../handlers/extra-handlers"

const distinctToggle = new ui.GscapeToggle()

distinctToggle.label = 'Duplicates'
distinctToggle.labelPosition = ui.GscapeToggle.ToggleLabelPosition.LEFT
distinctToggle.classList.add('actionable')
distinctToggle.disabled = true
distinctToggle.checked = true

distinctToggle.onclick = (evt) => {
  evt.preventDefault()

  if (!distinctToggle.disabled) {
    distinctToggle.checked = !distinctToggle.checked
    handleDistinctChange()
  }
}

export default distinctToggle