import FilterDialog from "./forms/filters/filter-dialog"
import FilterListDialog from "./forms/filters/filter-list-dialog"
import HighlightsList from "./highlights-list"
import ListSelectionDialog from "./list-selection-dialog"
import RelatedClassSelection from "./related-class-selection"
import SparqlDialog from "./sparql-dialog"
import SparqlingStartRunButtons from "./start-run-buttons"
import { ui } from 'grapholscape'
import FunctionDialog from "./forms/functions/function-dialog"
import AggregationDialog from "./forms/aggregation-functions/aggregation-functions-dialog"
import { code, refresh } from "./assets/icons"
import ContextMenuWidget from "./cxt-menu/cxt-menu-widget"

// export const sparqlDialog = new SparqlDialog()

// export const listSelectionDialog = new ListSelectionDialog()
export const relatedClassDialog = new RelatedClassSelection()
// export const highlightsList = new HighlightsList()
export const filterDialog = new FilterDialog()
// export const filterListDialog = new FilterListDialog()
export const functionDialog = new FunctionDialog()
// export const aggregationDialog = new AggregationDialog()
export const startRunButtons = new SparqlingStartRunButtons()
// export const errorsDialog = new UI.GscapeDialog()
// errorsDialog.title = 'Error'

// export { default as limit } from './limit'
// export { default as offset } from './offset'

// export const sparqlButton = new UI.GscapeButton(code, 'SPARQL')
// export const clearQueryButton = new ui.GscapeButton()
// export const distinctToggle = new UI.GscapeToggle('distinct', false, true, 'Duplicates', null, true)
// distinctToggle.style.marginRight = '5px'
// export const countStarToggle = new UI.GscapeToggle('count-star', false, true, 'Count Results')

export * from './cxt-menu'