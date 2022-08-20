import { ui } from "grapholscape"
import { handleCountStarChange } from "../handlers/extra-handlers"

const countStarToggle = new ui.GscapeToggle()

countStarToggle.label = 'Count Results'
countStarToggle.labelPosition = ui.GscapeToggle.ToggleLabelPosition.LEFT
countStarToggle.classList.add('actionable')
countStarToggle.disabled = true

countStarToggle.onclick = (evt) => {
  evt.preventDefault()

  if (!countStarToggle.disabled) {
    countStarToggle.checked = !countStarToggle.checked
    handleCountStarChange()
  }
}

export default countStarToggle