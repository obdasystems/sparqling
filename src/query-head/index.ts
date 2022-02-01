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

export function getHeadElementByID(headElemID: number): HeadElement {
  return head.find(headElement => headElement.id === headElemID)
}

export function render(head: HeadElement[]) {
  console.log(head)
  qhWidget.headElements = head
}