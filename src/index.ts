import { fullGrapholscape } from 'grapholscape'
import { StandaloneApi } from './api/swagger/api'
import { grapholscape as gscapeContainer } from './get-container'
import * as ontologyGraph from './ontology-graph'
import * as queryHandler from './query-handler/query-handler'

export default async function sparqling(sparqlingContainer: HTMLDivElement, file: string | File, isStandalone?: boolean) {
  sparqlingContainer.appendChild(gscapeContainer)
  const gscape = await fullGrapholscape(file, gscapeContainer, { owl_translator: false })
  ontologyGraph.init(gscape)
  queryHandler.init(gscape)

  if (isStandalone) {
    if (typeof file === 'string')
      file = new File([file], `${gscape.ontology.name}-from-string.graphol`)

    new StandaloneApi().standaloneOntologyUploadPost(file as File)
  }
}