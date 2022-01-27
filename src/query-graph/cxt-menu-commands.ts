import { CollectionReturnValue } from "cytoscape"

export enum Command {
  select = 'Select',
  addHead = 'Add to Head',
  delete = 'Delete',
  defineFilters = 'Define Filters'
}

export const commandList = (getCallback: (command: Command, elem: CollectionReturnValue ) => void) => [
  {
    content: Command.select,
    select: (e: CollectionReturnValue) => getCallback(Command.select, e)
  },
  {
    content: Command.addHead,
    select: (e: CollectionReturnValue) =>  getCallback(Command.addHead, e)
  },
  {
    content: Command.delete,
    select: (e: CollectionReturnValue) =>  getCallback(Command.delete, e)
  },
  {
    content: Command.defineFilters,
    select: (e: CollectionReturnValue) =>  getCallback(Command.defineFilters, e)
  },
]