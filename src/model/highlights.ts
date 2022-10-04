import { Highlights, OntologyGraphApi } from "../api/swagger";
import { handlePromise } from "../main/handle-promises";
import { getBasePath, getRequestOptions } from "./request-options";

let actualHighlights: Highlights

export async function computeHighlights(iri: string): Promise<Highlights> {
  const ogApi = new OntologyGraphApi(undefined, getBasePath())

  const highlightsPromise = handlePromise(ogApi.highligths(iri, undefined, getRequestOptions()))

  highlightsPromise.then(highlights => {
    actualHighlights = highlights
  })

  return highlightsPromise
}

export function getActualHighlights() { return actualHighlights }