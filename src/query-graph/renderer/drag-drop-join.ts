import { CollectionReturnValue, EventObject } from "cytoscape"
import { cy } from "./cy"

let joinStartCondition: (nodeId: string) => boolean
let joinAllowedCondition: (nodeId1: string, nodeId2: string) => boolean
let joinCallback: (nodeId1: string, nodeId2: string) => void

(cy as any).on('cdnddrop', (e: EventObject, parent: CollectionReturnValue, dropSibling: CollectionReturnValue) => {
  if (!parent.empty() && !dropSibling.empty()) {
    // avoid creating a compound node, we want to merge the two nodes
    dropSibling.move({ parent: null })
    e.target.move({ parent: null })
    parent.remove()

    joinCallback(e.target.id(), dropSibling.id())
  }
})

const compoundDragAndDropOption = {
  grabbedNode: (node: CollectionReturnValue) => joinStartCondition(node.id()),

  dropTarget: (dropTarget: CollectionReturnValue) =>
    joinAllowedCondition(dropTarget?.id(), cy.$(':grabbed').id()),

  dropSibling: (dropTarget: CollectionReturnValue, grabbedNode: CollectionReturnValue) =>
    joinAllowedCondition(dropTarget?.id(), cy.$(':grabbed').id())
}

const coumpoundDragAndDrop = (cy as any).compoundDragAndDrop(compoundDragAndDropOption)

export function setJoinStartCondition(callback: (nodeId: string) => boolean) {
  joinStartCondition = callback
}

export function setJoinAllowedCondition(callback: (nodeId1: string, nodeId2: string) => boolean) {
  joinAllowedCondition = callback
}

export function onJoin(callback: (nodeId1: string, nodeId2: string) => void) {
  joinCallback = callback
}

