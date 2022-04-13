import FilterDialog from "./forms/filters/filter-dialog"
import FilterListDialog from "./forms/filters/filter-list-dialog"
import HighlightsList from "./highlights-list"
import ListSelectionDialog from "./list-selection-dialog"
import RelatedClassSelection from "./related-class-selection"
import SparqlDialog from "./sparql-dialog"
import SparqlingStartRunButtons from "./start-run-buttons"
import { UI } from 'grapholscape'
import FunctionDialog from "./forms/functions/function-dialog"
import AggregationDialog from "./forms/aggregation-functions/aggregation-functions-dialog"

export const sparqlDialog = new SparqlDialog()

export const listSelectionDialog = new ListSelectionDialog()
export const relatedClassDialog = new RelatedClassSelection()
export const highlightsList = new HighlightsList()
export const filterDialog = new FilterDialog()
export const filterListDialog = new FilterListDialog()
export const functionDialog = new FunctionDialog()
export const aggregationDialog = new AggregationDialog()
export const startRunButtons = new SparqlingStartRunButtons()
export const errorsDialog = new UI.GscapeDialog()
errorsDialog.title = 'Error'