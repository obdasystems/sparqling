import { NodeSingular, SingularElementReturnValue, Stylesheet } from "cytoscape";
import { GrapholNode, GrapholscapeTheme, GrapholTypesEnum, IncrementalDiagram, IncrementalRendererState, Ontology, Renderer } from "grapholscape";
import { HIGHLIGHT_CLASS, SPARQLING_SELECTED } from "../../../model";
import style from "../style";
import getIncrementalStyle from "./style";

export default class SparqlingIncrementalRendererState extends IncrementalRendererState {
  private sparqlingCy: cytoscape.Core
  public activeClass?: SingularElementReturnValue
  
  constructor(cyInstance: cytoscape.Core) {
    super()
    this.sparqlingCy = cyInstance
    this.floatyLayoutOptions.edgeLength = () => 150
  }

  createNewDiagram() {
    this.unpinAll()
    this.renderer.renderStateData[this.id].diagram = new IncrementalDiagram()
    this.diagramRepresentation.cy = this.sparqlingCy
    this.activeClass = undefined
    // this.floatyLayoutOptions.fit = true
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
    return super.getGraphStyle(theme).concat(style(theme)).concat(getIncrementalStyle(theme))
  }

  runLayout() {
    if (!this.renderer.cy) return
    this.renderer.cy.$('[!isSuggestion]').lock()
    // Layout doesn't work with compound nodes, so remove children and add it back later
    const children = this.renderer.cy.filter((elem) => elem.isNode() && !elem[0].isChildless()).children()
    children.remove()
    super.runLayout()
    this.renderer.cy?.add(children)
    this._layout.on('layoutstop', () => {
      this.renderer.cy?.$('[!isSuggestion]').unlock()
    })
  }

}