import FilterDialog from "./forms/filters/filter-dialog"
import FilterListDialog from "./forms/filters/filter-list-dialog"
import HighlightsList from "./highlights-list"
import RelatedClassSelection from "./related-class-selection"
import SparqlDialog from "./sparql-dialog"
import SparqlingStartRunButtons from "./start-run-buttons"
import FunctionDialog from "./forms/functions/function-dialog"
import AggregationDialog from "./forms/aggregation-functions/aggregation-functions-dialog"
import ErrorsDialog from "./errors-dialog"
import SparqlingQueryResults from "./query-results-preview"
import LoadingDialog from "./loading-dialog"
import { ui } from "grapholscape"

export const sparqlDialog = new SparqlDialog()

export const relatedClassDialog = new RelatedClassSelection()
export const highlightsList = new HighlightsList()
export const filterDialog = new FilterDialog()
export const filterListDialog = new FilterListDialog()
export const functionDialog = new FunctionDialog()
export const aggregationDialog = new AggregationDialog()
export const startRunButtons = new SparqlingStartRunButtons()
export const errorsDialog = new ErrorsDialog()
export const previewDialog = new SparqlingQueryResults()
export const loadingDialog = new LoadingDialog()
export * from './class-selector'

export { default as limitInput } from './limit'
export { default as offsetInput } from './offset'
export { default as distinctToggle } from "./distinct-toggle"
export { default as countStarToggle } from './count-star-toggle'

// export * from './cxt-menu'
export const cxtMenu = new ui.GscapeContextMenu()

export const exitFullscreenButton = new ui.GscapeButton()
exitFullscreenButton.innerHTML = `<span slot="icon">${ui.icons.exitFullscreen.strings.join('')}</span>`
exitFullscreenButton.style.position = 'absolute'
exitFullscreenButton.style.top = '10px'
exitFullscreenButton.style.right = '10px'