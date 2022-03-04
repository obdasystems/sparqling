import { Filter, FilterExpression, HeadElement, VarOrConstant, VarOrConstantConstantTypeEnum } from "../api/swagger";
import { code } from "../widgets/assets/icons";
import QueryHeadWidget from "./qh-widget";
import { UI } from "grapholscape"

export const sparqlButton = new UI.GscapeButton(code, 'SPARQL')
const qhWidget = new QueryHeadWidget(sparqlButton)
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

export function onSetFilter(callback: (newFilter: Filter, headElement: HeadElement) => void) {
  qhWidget.onSetFilter((headElementId, operator, value, datatype) => {
    let headElement = getHeadElementByID(headElementId)
    let filter: Filter = {}
    let expression: FilterExpression = {}
    expression.operator = operator
    expression.parameters = []
    // First parameter is the GraphElement IRI
    expression.parameters.push({
      type: 'var',
      value: headElement.var
    })

    // Second parameter is the value to evaluate
    expression.parameters.push({
      type: 'constant',
      value: value,
      constantType: datatype
    })

    filter.expression = expression

    callback(filter, headElement)
  })
}