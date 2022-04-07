import { HeadElement } from "../api/swagger";
import { code, refresh } from "../widgets/assets/icons";
import QueryHeadWidget from "./qh-widget";
import { UI } from "grapholscape"

export const sparqlButton = new UI.GscapeButton(code, 'SPARQL')
export const clearQueryButton = new UI.GscapeButton(refresh, 'Clear Query')
const qhWidget = new QueryHeadWidget([sparqlButton, clearQueryButton])
let head: HeadElement[]

export {qhWidget as widget}

export function onDelete(callback: (headElement: HeadElement) => void) {
  qhWidget.onDelete( headElementId => callback(getHeadElementByID(headElementId)))
}

export function onRename(callback: (headElement: HeadElement, alias: string) => void) {
  qhWidget.onRename( (headElementId: string, alias:string) => {
    callback(getHeadElementByID(headElementId), alias)
  })
}

export function onLocalize(callback: (headElement: HeadElement) => void) {
  qhWidget.onLocalize( headElementId => callback(getHeadElementByID(headElementId)))
}

export function getHeadElementByID(headElementId: string): HeadElement {
  return head.find(headElement => headElement.id === headElementId)
}

export function render(newHead = head) {
  qhWidget.headElements = newHead
}

export function setHead(newHhead: HeadElement[]) {
  head = newHhead
}

export function onAddFilter(callback: (headElement: HeadElement) => void) {
  qhWidget.onAddFilter((headElementId) => {
    let headElement = getHeadElementByID(headElementId)
    callback(headElement)
  })
}

export function onEditFilter(callback: (filterId: number) => void) {
  qhWidget.onEditFilter(filterId => callback(filterId))
}

export function onDeleteFilter(callback: (filterId: number) => void) {
  qhWidget.onDeleteFilter(filterId => callback(filterId))
}

export { onElementSortChange } from './drag-sorting'