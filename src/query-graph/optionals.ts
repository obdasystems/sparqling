import { GraphElement } from "../api/swagger";
import { getGraphElementByID } from "../util/graph-element-utility";
import * as bgp from "./renderer"

export function onMakeOptional(callback: (graphElement: GraphElement) => void) {
  bgp.onMakeOptional((elemId: string) => callback(getGraphElementByID(elemId)))
}

export function onRemoveOptional(callback: (graphElement: GraphElement) => void) {
  bgp.onRemoveOptional((elemId: string) => callback(getGraphElementByID(elemId)))
}