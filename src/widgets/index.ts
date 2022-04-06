import FilterDialog from "./filters/filter-dialog"
import FilterListDialog from "./filters/filter-list-dialog"
import HighlightsList from "./highlights-list"
import ListSelectionDialog from "./list-selection-dialog"
import RelatedClassSelection from "./related-class-selection"
import SparqlDialog from "./sparql-dialog"
import SparqlingStartRunButtons from "./start-run-buttons"
import { UI } from 'grapholscape'

export const sparqlDialog = new SparqlDialog()

export const listSelectionDialog = new ListSelectionDialog()
export const relatedClassDialog = new RelatedClassSelection()
export const highlightsList = new HighlightsList()
export const filterDialog = new FilterDialog()
export const filterListDialog = new FilterListDialog()
export const startRunButtons = new SparqlingStartRunButtons()
export const errorsDialog = new UI.GscapeDialog()
errorsDialog.title = 'Error'