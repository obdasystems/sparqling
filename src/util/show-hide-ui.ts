import { widget as queryGraphWidget } from "../query-graph"
import { cxtMenu } from "../query-graph/renderer"
import { widget as queryHeadWidget } from "../query-head" 
import { errorsDialog, filterDialog, filterListDialog, highlightsList, relatedClassDialog, sparqlDialog } from "../widgets"

export function showUI() {
  queryGraphWidget.show()
  queryHeadWidget.show()
  highlightsList.show()
}

export function hideUI() {
  queryGraphWidget.hide()
  queryHeadWidget.hide()
  highlightsList.hide()
  sparqlDialog.hide()
  relatedClassDialog.hide()
  cxtMenu.hide()
  filterDialog.hide()
  filterListDialog.hide()
  errorsDialog.hide()
}