import { CollectionReturnValue } from "cytoscape"
import { commandAddFilterText, commandAddHeadText, commandDeleteText } from "../../widgets/assets/texts"
import cy from "./cy"
import { DISPLAYED_NAME } from "./graph-manipulation"

let addHeadCallback: (elemId: string) => void
let deleteCallback: (elemId: string) => void
let addFilterCallback: (elemId: string) => void

const menu = (cy as any).cxtmenu(getMenuOption())

function getMenuOption() {
  return {
    selector: `[${DISPLAYED_NAME}]`,
    commands: [
      {
        content: commandAddHeadText(),
        select: (e: CollectionReturnValue) => addHeadCallback(e.id())
      },
      {
        content: commandDeleteText(),
        select: (e: CollectionReturnValue) => deleteCallback(e.id())
      },
      {
        content: commandAddFilterText(),
        select: (e: CollectionReturnValue) => addFilterCallback(e.id())
      },
    ],
    // openMenuEvents: 'tap',
    // fillColor: '',
    // activeFillColor: '',
    // itemColor: '',
  }
}

export function onAddHead(callback: (elemId: string) => void) {
  addHeadCallback = callback
}

export function onDelete(callback: (elemId: string) => void) {
  deleteCallback = callback
}

export function onAddFilter(callback: (elemId: string) => void) {
  addFilterCallback = callback
}
