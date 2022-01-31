import { HeadElement } from "../api/swagger/models";
import QueryHeadWidget from "./qh-widget";

const qhWidget = new QueryHeadWidget()
let head: HeadElement[]

export {qhWidget as widget}

export function onDelete(callback: (headElem: HeadElement) => void) {
  qhWidget.onDelete( headElemID => callback(getHeadElementByID(headElemID)))
}

export function getHeadElementByID(headElemID: number): HeadElement {
  return head.find(headElement => headElement.id === headElemID)
}

export function render(head: HeadElement[]) {
  qhWidget.headElements = head
}