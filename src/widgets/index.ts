import { UI } from "grapholscape"
import { emptyQueryMsg } from "./assets/texts"
import FilterDialog from "./filters/filter-dialog"
import FilterListDialog from "./filters/filter-list-dialog"
import HighlightsList from "./highlights-list"
import ListSelectionDialog from "./list-selection-dialog"
import RelatedClassSelection from "./related-class-selection"

export const sparqlDialog = new UI.GscapeDialog()
sparqlDialog.title = 'SPARQL'
sparqlDialog.text = emptyQueryMsg()

export const listSelectionDialog = new ListSelectionDialog()
export const relatedClassDialog = new RelatedClassSelection()
export const highlightsList = new HighlightsList()
export const filterDialog = new FilterDialog()
export const filterListDialog = new FilterListDialog()