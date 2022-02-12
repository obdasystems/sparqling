import { CollectionReturnValue, SingularData } from "cytoscape"
import { EntityTypeEnum } from "../../api/swagger"
import { commandAddFilterText, commandAddHeadText, commandDeleteText, commandMakeOptionalText, commandRemoveOptionalText } from "../../widgets/assets/texts"
import cy from "./cy"

let addHeadCallback: (elemId: string) => void
let deleteCallback: (elemId: string) => void
let addFilterCallback: (elemId: string) => void
let makeOptionalCallback: (elemId: string) => void
let removeOptionalCallback: (elemId: string) => void

// const menu = (cy as any).cxtmenu(menuOptions)


const addHead = {
  content: commandAddHeadText(),
  select: (e: SingularData) => addHeadCallback(e.id())
}
const del = {
  content: commandDeleteText(),
  select: (e: SingularData) => deleteCallback(e.id())
}
const addFilter = {
  content: commandAddFilterText(),
  select: (e: SingularData) => addFilterCallback(e.id())
}
const makeOptional = {
  content: commandMakeOptionalText(),
  select: (e: SingularData) => makeOptionalCallback(e.id())
}
const removeOptional = {
  content: commandRemoveOptionalText(),
  select: (e: SingularData) => removeOptionalCallback(e.id())
}

const menuOptions = {
  classesOrDataProps: {
    selector: `[!optional][type = "${EntityTypeEnum.Class}"],[!optional][type = "${EntityTypeEnum.DataProperty}"]`,
    commands: [addHead, del, addFilter, makeOptional],
    // openMenuEvents: 'tap',
    // fillColor: '',
    // activeFillColor: '',
    // itemColor: '',
  },
  objProps: {
    selector: `[!optional][type = "${EntityTypeEnum.ObjectProperty}"]`,
    commands: [del, addFilter, makeOptional],
    // openMenuEvents: 'tap',
    // fillColor: '',
    // activeFillColor: '',
    // itemColor: '',
  },
  optionalClassesOrDataProps: {
    selector: `[?optional][type = "${EntityTypeEnum.Class}"],[?optional][type = "${EntityTypeEnum.DataProperty}"]`,
    commands: [addHead, del, addFilter, removeOptional],
    // openMenuEvents: 'tap',
    // fillColor: '',
    // activeFillColor: '',
    // itemColor: '',
  },
  optionalObjProps: {
    selector: `[?optional][type = "${EntityTypeEnum.ObjectProperty}"]`,
    commands: [del, addFilter, removeOptional],
    // openMenuEvents: 'tap',
    // fillColor: '',
    // activeFillColor: '',
    // itemColor: '',
  }
}

Object.values(menuOptions).forEach(opt => cy.cxtmenu(opt as any))

export function onAddHead(callback: (elemId: string) => void) {
  addHeadCallback = callback
}

export function onDelete(callback: (elemId: string) => void) {
  deleteCallback = callback
}

export function onAddFilter(callback: (elemId: string) => void) {
  addFilterCallback = callback
}

export function onMakeOptional(callback: (elemId: string) => void){
  makeOptionalCallback = callback
}

export function onRemoveOptional(callback: (elemId: string) => void){
  removeOptionalCallback = callback
}