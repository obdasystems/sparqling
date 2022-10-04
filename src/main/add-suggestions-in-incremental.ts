import * as model from "../model"
import * as queryGraph from '../query-graph'

export default async function(classIri: string) {
  const highlights = await model.computeHighlights(classIri)
  
  highlights.classes?.forEach(classIri => {
    queryGraph.addClassSuggestion(classIri)
  })
}