import { NodeSingular, Stylesheet } from "cytoscape";
import { GrapholNode, GrapholscapeTheme, GrapholTypesEnum, IncrementalDiagram, IncrementalRendererState, Ontology, Renderer } from "grapholscape";
import style from "../style";

export default class SparqlingIncrementalRendererState extends IncrementalRendererState {
  private sparqlingCy: cytoscape.Core
  
  constructor(cyInstance: cytoscape.Core) {
    super()
    this.sparqlingCy = cyInstance
  }

  createNewDiagram() {
    this.unpinAll()
    this.renderer.renderStateData[this.id].diagram = new IncrementalDiagram()
    this.diagramRepresentation.cy = this.sparqlingCy
    this.activeClass = undefined
    this.floatyLayoutOptions.fit = true
    this.overrideDiagram()
    //this.diagramRepresentation.cy.on('dblclick', `node[type = "${GrapholTypesEnum.CLASS}"]`, (evt) => this.handleClassExpansion(evt.target))
    if (this.renderer.diagram) {
      this.popperContainers.set(this.renderer.diagram?.id, document.createElement('div'))
    }
    this.setDragAndPinEventHandlers()
    this.render()
  }

  // No need for transforming the ontology
  transformOntology(ontology: Ontology): void {}

  getGraphStyle(theme: GrapholscapeTheme): Stylesheet[] {
    return style(theme)
  }

}