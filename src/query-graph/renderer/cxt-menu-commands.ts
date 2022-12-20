import { SingularElementReturnValue } from "cytoscape"
import { EntityTypeEnum } from "../../api/swagger"
import { getHeadElementByID, isCountStarActive, isStandalone } from "../../model"
import { addFilter as addFilterIcon, editList, dashedCross, questionMarkDashed, rubbishBin, tableColumnPlus, preview } from "../../widgets/assets/icons"
import { commandAddFilterText, commandAddHeadText, commandDeleteText, commandMakeOptionalText, commandRemoveOptionalText } from "../../widgets/assets/texts"
import { ui } from 'grapholscape'

let addHeadCallback: (elemId: string) => void
let deleteCallback: (elemId: string, elemIri?: string) => void
let addFilterCallback: (elemId: string) => void
let seeFiltersCallback: (elemId: string) => void
let makeOptionalCallback: (elemId: string) => void
let removeOptionalCallback: (elemId: string) => void
let showExamplesCallback: (elemId: string) => void

let _ele: SingularElementReturnValue
export function getCommandsForElement(elem: SingularElementReturnValue) {
  _ele = elem
  const commands: ui.Command[] = []

  // COMANDI OPTIONALS SU OBJECT PROPERTY
  if (elem.data().type === EntityTypeEnum.ObjectProperty || elem.data().type === EntityTypeEnum.InverseObjectProperty) {
    if (elem.data().optional) {
      commands.push(removeOptional)
    } else {
      commands.push(makeOptional)
    }
  }

  else {
    if (!elem.isChild()) {

      if (!getHeadElementByID('?' + elem.id()) && !isCountStarActive()) {
        commands.push(addHead)
      }

      if (elem.data().hasFilters) {
        commands.push(seeFilters)
      }

      commands.push(addFilter)

      if (!isStandalone() && (elem.data().type === EntityTypeEnum.Class || elem.data().type === EntityTypeEnum.DataProperty)) {
        commands.push(showExamples)
      }

      if (!elem.incomers().empty() && elem.data().type !== EntityTypeEnum.Class) {
        if (elem.data().optional) {
          commands.push(removeOptional)
        } else {
          commands.push(makeOptional)
        }
      }
    }
    commands.push(del)
  }

  return commands
}

const addHead: ui.Command = {
  content: commandAddHeadText(),
  icon: tableColumnPlus,
  select: () => addHeadCallback(_ele.id())
}
const del: ui.Command = {
  content: commandDeleteText(),
  icon: rubbishBin,
  select: () => {
    _ele.isChild() ? deleteCallback(_ele.id(), _ele.data().iri) : deleteCallback(_ele.id())
  }
}
const addFilter: ui.Command = {
  content: commandAddFilterText(),
  icon: addFilterIcon,
  select: () => addFilterCallback(_ele.id())
}
const makeOptional: ui.Command = {
  content: commandMakeOptionalText(),
  icon: questionMarkDashed,
  select: () => makeOptionalCallback(_ele.id())
}
const removeOptional: ui.Command = {
  content: commandRemoveOptionalText(),
  icon: dashedCross,
  select: () => removeOptionalCallback(_ele.id())
}
const seeFilters: ui.Command = {
  content: 'See Filters',
  icon: editList,
  select: () => seeFiltersCallback(_ele.id())
}

const showExamples: ui.Command = {
  content: 'Show Examples',
  icon: preview,
  select: () => showExamplesCallback(_ele.id())
}

export function onAddHead(callback: (elemId: string) => void) {
  addHeadCallback = callback
}

export function onDelete(callback: (elemId: string, elemIri?: string) => void) {
  deleteCallback = callback
}

export function onAddFilter(callback: (elemId: string, elemIri?: string) => void) {
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

export function onShowExamples(callback: (elemId: string) => void) {
  showExamplesCallback = callback
}