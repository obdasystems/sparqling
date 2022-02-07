import { UI } from "grapholscape"
import { emptyQueryMsg } from "./assets/texts"
import ListSelectionDialog from "./list-selection-dialog"

export const sparqlDialog = new UI.GscapeDialog()
sparqlDialog.title = 'SPARQL'
sparqlDialog.text = emptyQueryMsg()

export const listSelectionDialog = new ListSelectionDialog()