import { HeadElement } from "../api/swagger";
import { code, refresh } from "../widgets/assets/icons";
import QueryHeadWidget from "./qh-widget";
import { UI } from "grapholscape"
import * as model from '../model'

export const sparqlButton = new UI.GscapeButton(code, 'SPARQL')
export const clearQueryButton = new UI.GscapeButton(refresh, 'Clear Query')
const qhWidget = new QueryHeadWidget([sparqlButton, clearQueryButton])

export {qhWidget as widget}

export function onDelete(callback: (headElement: HeadElement) => void) {
  qhWidget.onDelete( headElementId => callback(model.getHeadElementByID(headElementId)))
}

export function onRename(callback: (headElement: HeadElement, alias: string) => void) {
  qhWidget.onRename( (headElementId: string, alias:string) => {
    callback(model.getHeadElementByID(headElementId), alias)
  })
}

export function onLocalize(callback: (headElement: HeadElement) => void) {
  qhWidget.onLocalize( headElementId => callback(model.getHeadElementByID(headElementId)))
}



export function render(newHead: HeadElement[]) {
  if (!newHead) return

  qhWidget.headElements = newHead
}


export function onAddFilter(callback: (headElement: HeadElement) => void) {
  qhWidget.onAddFilter((headElementId) => {
    let headElement = model.getHeadElementByID(headElementId)
    callback(headElement)
  })
}

export function onEditFilter(callback: (filterId: number) => void) {
  qhWidget.onEditFilter(filterId => callback(filterId))
}

export function onDeleteFilter(callback: (filterId: number) => void) {
  qhWidget.onDeleteFilter(filterId => callback(filterId))
}

export function onAddFunction(callback: (headElementId: string) => void) {
  qhWidget.onAddFunction(headElementId => callback(headElementId))
}

export { onElementSortChange } from './drag-sorting'