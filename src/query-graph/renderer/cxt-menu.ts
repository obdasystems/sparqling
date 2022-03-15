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

const seeFilters = {
  content: 'See Filters',
  select: (e) => { console.log('see filters') }
}

const menuOptions = {
  classesOrDataProps: {
    selector: `node[!optional][!hasFilters][type = "${EntityTypeEnum.Class}"],node[!optional][!hasFilters][type = "${EntityTypeEnum.DataProperty}"]`,
    commands: [addHead, del, addFilter, makeOptional],
  },
  optionalClassesOrDataProps: {
    selector: `node[?optional][!hasFilters][type = "${EntityTypeEnum.Class}"],node[?optional][!hasFilters][type = "${EntityTypeEnum.DataProperty}"]`,
    commands: [addHead, del, addFilter, removeOptional],
  },
  classesOrDataPropsWithFilters: {
    selector: `node[!optional][?hasFilters][type = "${EntityTypeEnum.Class}"],node[!optional][?hasFilters][type = "${EntityTypeEnum.DataProperty}"]`,
    commands: [addHead, del, addFilter, seeFilters, makeOptional],
  },
  optionalClassesOrDataPropsWithFilters: {
    selector: `node[?optional][?hasFilters][type = "${EntityTypeEnum.Class}"],node[?optional][?hasFilters][type = "${EntityTypeEnum.DataProperty}"]`,
    commands: [addHead, del, addFilter, seeFilters, removeOptional],
  },
  objProps: {
    selector: `edgeedge[!optional][!hasFilters][type = "${EntityTypeEnum.ObjectProperty}"]`,
    commands: [del, addFilter, makeOptional],
  },
  optionalObjProps: {
    selector: `edge[?optional][!hasFilters][type = "${EntityTypeEnum.ObjectProperty}"]`,
    commands: [del, addFilter, removeOptional],
  },
  objPropsWithFilters: {
    selector: `edge[!optional][?hasFilters][type = "${EntityTypeEnum.ObjectProperty}"]`,
    commands: [del, addFilter, makeOptional, seeFilters],
  },
  optionalObjPropsWithFilters: {
    selector: `edge[?optional][?hasFilters][type = "${EntityTypeEnum.ObjectProperty}"]`,
    commands: [del, addFilter, removeOptional, seeFilters],
  },
}

Object.values(menuOptions).forEach(opt => (cy as any).cxtmenu(opt as any))

export function onAddHead(callback: (elemId: string) => void) {
  addHeadCallback = callback
}

export function onDelete(callback: (elemId: string) => void) {
  deleteCallback = callback
}

export function onAddFilter(callback: (elemId: string) => void) {
  addFilterCallback = callback
}

export function onMakeOptional(callback: (elemId: string) => void) {
  makeOptionalCallback = callback
}

export function onRemoveOptional(callback: (elemId: string) => void) {
  removeOptionalCallback = callback
}