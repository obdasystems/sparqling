import { UI } from "grapholscape"
import { emptyQueryMsg } from "./assets/texts"
import ClassSelectionDialog from "./class-selection-dialog"

export const sparqlDialog = new UI.GscapeDialog()
sparqlDialog.message = { type: 'SPARQL', text: emptyQueryMsg() }
export { ClassSelectionDialog }