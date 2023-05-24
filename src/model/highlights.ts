import { Branch, Highlights, OntologyGraphApi } from "../api/swagger";
import { handlePromise } from "../main/handle-promises";
import getPrefixedIri from "../util/get-prefixed-iri";
import { getBasePath, getRequestOptions } from "./request-options";

let actualHighlights: Highlights | undefined

export async function computeHighlights(iri: string): Promise<Highlights> {
  const ogApi = new OntologyGraphApi(undefined, getBasePath())

  const highlights = await handlePromise(ogApi.highligths(iri, undefined, getRequestOptions()))
  if (!actualHighlights) {
    actualHighlights = highlights
    actualHighlights.classes = highlights.classes || []
    actualHighlights.dataProperties = highlights.dataProperties || []
    actualHighlights.objectProperties = highlights.objectProperties || []
  } else {
    if (highlights.classes) {
      if (actualHighlights.classes) {
        actualHighlights.classes = Array.from(new Set([...actualHighlights.classes, ...highlights.classes]))
      }
    }

    if (highlights.dataProperties) {
      if (actualHighlights.dataProperties) {
        actualHighlights.dataProperties = Array.from(new Set([...actualHighlights.dataProperties, ...highlights.dataProperties]))
      }
    }

    if (highlights.objectProperties) {
      if (actualHighlights.objectProperties) {
        const branches: Branch[] = []

        for (let newBranch of highlights.objectProperties) {
          if (actualHighlights.objectProperties.every(b => b.objectPropertyIRI !== newBranch.objectPropertyIRI)) {
            branches.push(newBranch)
          }
        }

        actualHighlights.objectProperties.push(...branches)
      }
    }
  }

  return actualHighlights
}

export function getActualHighlights() { return actualHighlights }

export function transformHighlightsToPrefixedIRIs(): Highlights {
  let transformedHighlights: Highlights = JSON.parse(JSON.stringify(actualHighlights))
  transformedHighlights.classes = transformedHighlights.classes?.map(iri => getPrefixedIri(iri))
  transformedHighlights.dataProperties = transformedHighlights.dataProperties?.map(iri => getPrefixedIri(iri))
  transformedHighlights.objectProperties = transformedHighlights.objectProperties?.map(branch => {
    branch.objectPropertyIRI = getPrefixedIri(branch.objectPropertyIRI || '')
    branch.relatedClasses = branch.relatedClasses?.map(iri => getPrefixedIri(iri))
    return branch
  })
  return transformedHighlights
}

export function isIriHighlighted(iri: string) {
  return actualHighlights?.classes?.includes(iri) ||
    actualHighlights?.dataProperties?.includes(iri) ||
    actualHighlights?.objectProperties?.some(branch => branch.objectPropertyIRI === iri)
}

export function clearHighlights() {
  actualHighlights = undefined
}