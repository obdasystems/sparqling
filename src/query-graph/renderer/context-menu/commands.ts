import { SingularData } from "cytoscape"
import { EntityTypeEnum } from "../../../api/swagger"
import { addFilter as addFilterIcon, editList, questionMarkDashed, rubbishBin, tableColumnPlus } from "../../../widgets/assets/icons"
import { commandAddFilterText, commandAddHeadText, commandDeleteText, commandMakeOptionalText, commandRemoveOptionalText } from "../../../widgets/assets/texts"


export interface Command {
  content: string,
  icon?: any,
  select: () => void,
}

let addHeadCallback: (elemId: string) => void
let deleteCallback: (elemId: string) => void
let addFilterCallback: (elemId: string) => void
let seeFiltersCallback: (elemId: string) => void
let makeOptionalCallback: (elemId: string) => void
let removeOptionalCallback: (elemId: string) => void

let _ele: SingularData
export function getCommandsForElement(ele: SingularData) {
  _ele = ele
  const commands = []

  if (ele.data().type === EntityTypeEnum.Class || ele.data().type === EntityTypeEnum.DataProperty) {
    commands.push(addHead)

    if (ele.data().hasFilters) {
      commands.push(seeFilters)
    }

    commands.push(addFilter)
  }

  if (ele.data().optional) {
    commands.push(removeOptional)
  } else {
    commands.push(makeOptional)
  }

  commands.push(del)
  return commands
}

const addHead: Command = {
  content: commandAddHeadText(),
  icon: tableColumnPlus,
  select: () => addHeadCallback(_ele.id())
}
const del: Command = {
  content: commandDeleteText(),
  icon: rubbishBin,
  select: () => {
    deleteCallback(_ele.id())
  }
}
const addFilter: Command = {
  content: commandAddFilterText(),
  icon: addFilterIcon,
  select: () => addFilterCallback(_ele.id())
}
const makeOptional: Command = {
  content: commandMakeOptionalText(),
  icon: questionMarkDashed,
  select: () => makeOptionalCallback(_ele.id())
}
const removeOptional: Command = {
  content: commandRemoveOptionalText(),
  select: () => removeOptionalCallback(_ele.id())
}
const seeFilters: Command = {
  content: 'See Filters',
  icon: editList,
  select: () => seeFiltersCallback(_ele.id())
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

export function onSeeFilters(callback: (elemId: string) => void) {
  seeFiltersCallback = callback
}

export function onMakeOptional(callback: (elemId: string) => void) {
  makeOptionalCallback = callback
}

export function onRemoveOptional(callback: (elemId: string) => void) {
  removeOptionalCallback = callback
}