import { Iri } from "grapholscape"
import { getGscape } from "../ontology-graph"

export default function(iriValue: string) {
  const iri = new Iri(iriValue, getGscape().ontology.namespaces)
  return iri.prefixed || iriValue
}