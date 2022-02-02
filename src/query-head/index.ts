import { HeadElement } from "../api/swagger/models";
import { code } from "./icons";
import QueryHeadWidget from "./qh-widget";
import { UI } from "grapholscape"

export const sparqlButton = new UI.GscapeButton(code, 'SPARQL')
const qhWidget = new QueryHeadWidget(sparqlButton)
let head: HeadElement[]

export {qhWidget as widget}

export function onDelete(callback: (headElem: HeadElement) => void) {
  qhWidget.onDelete( headElemID => callback(getHeadElementByID(headElemID)))
}

export function onRename(callback: (headElemID: HeadElement, alias: string) => void) {
  qhWidget.onRename( (headElemID: number, alias:string) => {
    callback(getHeadElementByID(headElemID), alias)
  })
}

export function getHeadElementByID(headElemID: number): HeadElement {
  return head.find(headElement => headElement.id === headElemID)
}

export function render(newHead = head) {
  qhWidget.headElements = newHead
}

export function setHead(newHhead: HeadElement[]) {
  head = newHhead
}