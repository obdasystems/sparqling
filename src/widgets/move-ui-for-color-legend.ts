import { leftColumnContainer } from "../util/get-container"

export function moveUIForColorLegend(isActive: boolean) {
  leftColumnContainer.style.bottom = isActive ? '40px' : '0'
  leftColumnContainer.style.height = isActive ? 'calc(100% - 80px)' : 'calc(100% - 40px)'
}