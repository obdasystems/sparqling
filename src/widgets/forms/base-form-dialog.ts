import { ui } from 'grapholscape'
import { LitElement, PropertyValueMap, TemplateResult } from 'lit'
import { FilterExpressionOperatorEnum, FunctionNameEnum, GroupByElementAggregateFunctionEnum, VarOrConstant, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from '../../api/swagger'
import { QueryResult } from '../../main'
import { FormID, FormOperator, FormWidget } from '../../util/filter-function-interface'
import { loadingSpinnerStyle } from '../loading-spinner'
import { ExampleSelectionEvent, queryResultTemplateStyle } from '../query-result-template'
import sparqlingWidgetStyle from '../sparqling-widget-style'
import formStyle from './form-style'
import validateForm from './validate-form'

export enum Modality {
  DEFINE = 'Define',
  EDIT = 'Edit'
}

export default class SparqlingFormDialog extends ui.ModalMixin(ui.BaseMixin(LitElement)) implements FormWidget {
  protected left_icon: TemplateResult
  // protected saveButton = new UI.GscapeButton(checkmark, "Save")
  // protected deleteButton = new UI.GscapeButton(rubbishBin, "Delete")
  public operator?: FormOperator
  public parameters?: VarOrConstant[]
  public parametersType?: VarOrConstantTypeEnum
  public _id?: FormID
  public modality: Modality = Modality.DEFINE
  public aggregateOperator?: GroupByElementAggregateFunctionEnum
  public variableName?: string
  protected deleteCallback = (filterId: any) => { }
  protected submitCallback: any
  public formTitle?: string
  public canSave?: boolean
  public datatypeFromOntology?: string

  /**
   * this means that the dialog can receive focus but is not
   * focusable using tab.
   * this allows regex selection panel to blur (disappear) on click outside panel
   */
  private tabindex = '-1'

  // Examples
  public acceptExamples = false
  public examples?: QueryResult
  public loadingExamples = false
  public examplesSearchValue?: string
  protected seeExamplesCallback = () => { }

  static properties = {
    operator: { attribute: false },
    parameters: { attribute: false },
    modality: { attribute: false },
    datatype: { attribute: false },
    datatypeFromOntology: { type: String},
    aggregateOperator: { attribute: false },
    examples: { attribute: false },
    loadingExamples: { attribute: false, type: Boolean },
    acceptExamples: { attribute: false, type: Boolean },
    canSave: { type: Boolean },
    tabindex: { type: String, attribute: 'tabindex', reflect: true }
  }

  static styles = [
    ui.baseStyle,
    queryResultTemplateStyle,
    loadingSpinnerStyle,
    sparqlingWidgetStyle,
    formStyle,
  ]

  constructor() {
    super()

    this.addEventListener('onexampleselection', (event: ExampleSelectionEvent) => {
      if (this.parameters && event.detail) {
        let parameterIndex = this.parameters.length - 1 // default use last parameter
        
        // If there is an input activated, then replace its value
        if (this.inputElems) {
          for(const input of this.inputElems){
            if (input.matches(':focus')) {
              parameterIndex = parseInt(input.getAttribute('index') || '0') || parameterIndex
              break
            }
          }
        }
        
        this.parameters[parameterIndex].value = event.detail.exampleValue
        this.requestUpdate()
      }
    })
  }
  protected handleSubmit() {
    if (this.formElement && validateForm(this.formElement)) {
      this.normalizeDatatypes()
      this.onValidSubmit()
    }
  }

  private normalizeDatatypes() {
    if (this.datatypeFromOntology === 'xsd:int' ||
      this.datatypeFromOntology === 'xsd:integer' ||
      this.datatypeFromOntology === 'xsd:double' ||
      this.datatypeFromOntology === 'xsd:float' ||
      this.datatypeFromOntology === 'xsd:long' ||
      this.datatypeFromOntology === 'xsd:short' ||
      this.datatypeFromOntology === 'xsd:unsignedInt' ||
      this.datatypeFromOntology === 'xsd:unsignedLong' ||
      this.datatypeFromOntology === 'xsd:unsignedShort'
    )
      this.datatype = VarOrConstantConstantTypeEnum.Decimal
    else if (Object.values(VarOrConstantConstantTypeEnum).includes(this.datatypeFromOntology as VarOrConstantConstantTypeEnum))
      this.datatype = this.datatypeFromOntology as VarOrConstantConstantTypeEnum
    else 
      this.datatype = VarOrConstantConstantTypeEnum.String
  }

  private onOperatorChange(value: FormOperator) {
    this.operator = value

    switch (this.operator) {
      case FilterExpressionOperatorEnum.In:
      case FilterExpressionOperatorEnum.NotIn:
        // IN and NOT IN needs at least 2 constants, so at least 3 parameters, variable + 2 constants
        if (this.parametersIriOrConstants && this.parametersIriOrConstants.length < 2) {
          this.addInputValue(2 - this.parametersIriOrConstants.length)
        }
        break

      case FunctionNameEnum.Ceil:
      case FunctionNameEnum.Floor:
      case FunctionNameEnum.Round:
      case FunctionNameEnum.Day:
      case FunctionNameEnum.Year:
      case FunctionNameEnum.Month:
      case FunctionNameEnum.Hours:
      case FunctionNameEnum.Minutes:
      case FunctionNameEnum.Seconds:
      case FunctionNameEnum.Lcase:
      case FunctionNameEnum.Ucase:
        this.parameters?.splice(1) // no parameters
        break;

      default:
        this.parameters?.splice(2)
        if (this.parametersIriOrConstants && this.parametersIriOrConstants.length <= 0) {
          this.addInputValue()
        }
    }
  }

  protected onDatatypeChange(value: VarOrConstantConstantTypeEnum) {
    this.datatype = value
  }

  private onInputChange(index: number, inputElem: HTMLInputElement) {
    if (this.parameters) {
      if (this.datatype === VarOrConstantConstantTypeEnum.DateTime) {
        this.parameters[index].value = inputElem.valueAsDate?.toISOString()
      } else {
        this.parameters[index].value = inputElem.value
      }
    }
  }

  addInputValue(number = 1) {
    for (let i = 0; i < number; i++) {
      this.parameters?.push({
        type: this.parametersType,
        value: "",
        constantType: this.datatype
      })
    }

    this.requestUpdate()
  }

  removeInputValue() {
    this.parameters?.pop()

    this.requestUpdate()
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties)
    this.hide()
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.updated(_changedProperties)

    if (this.selectOperatorElem)
      this.selectOperatorElem.onchange = () => this.onOperatorChange(this.selectOperatorElem.value as FormOperator)

    if (this.selectDatatypeElem)
      this.selectDatatypeElem.onchange = (e) => this.onDatatypeChange(this.selectDatatypeElem.value as VarOrConstantConstantTypeEnum)

    this.inputElems?.forEach((input: any) =>
      input.onchange = (e) => this.onInputChange(input.getAttribute('index'), e.currentTarget)
    )

    const addInputButton = this.shadowRoot?.querySelector('#add-input-btn') as HTMLElement
    if (addInputButton)
      addInputButton.onclick = () => this.addInputValue()

    const removeInputButton = this.shadowRoot?.querySelector('#remove-input-btn') as HTMLElement
    if (removeInputButton)
      removeInputButton.onclick = () => this.removeInputValue()

    const seeExamplesButton = this.shadowRoot?.querySelector('#show-examples') as HTMLElement
    if (seeExamplesButton)
      seeExamplesButton.onclick = () => this.handleShowHideExamplesClick()

    if (this.searchExamplesInput) {
      this.searchExamplesInput.onchange = () => {
        this.examplesSearchValue = this.searchExamplesInput.value
      }

      this.searchExamplesInput.onkeyup = (e) => {
        if (e.key === 'Enter') {
          this.seeExamplesCallback()
        }
      }
    }
  }

  addMessage(msg: string, msgType: string) {
    if (!this.messagesElem) return

    let msgDiv = document.createElement('div')
    msgDiv.classList.add(msgType)
    msgDiv.innerHTML = msg
    this.messagesElem.appendChild(msgDiv)
  }

  resetMessages() {
    if (this.messagesElem)
      this.messagesElem.textContent = ''
  }

  setAsCorrect(customText?: string) {
    const text = customText || 'Correctly Saved'
    this.addMessage(text, 'correct-message')
    setTimeout(() => this.resetMessages(), 2000)
  }

  onSeeExamples(callback: (variable: VarOrConstant) => void) {
    this.seeExamplesCallback = () => {
      if (this.variable) {
        this.loadingExamples = true
        callback(this.variable)
      }
    }
  }

  setDefaultOperator() {
    this.onOperatorChange(this.operators[0])
  }

  private handleShowHideExamplesClick() {
    if (this.variable && !this.examples) {
      this.seeExamplesCallback()
    } else {
      this.iriExamplesTable.classList.toggle('hide')
      this.searchExamplesInput.classList.toggle('hide')
    }
  }

  protected onValidSubmit() {
    this.submitCallback(this._id, this.operator, this.parameters)
  }

  protected get operators(): FormOperator[] {
    return []
  }

  protected get selectOperatorElem() {
    return this.shadowRoot?.querySelector('#select-operator > select') as HTMLSelectElement
  }

  protected get selectDatatypeElem() {
    return this.shadowRoot?.querySelector('#select-datatype > select') as HTMLSelectElement
  }

  protected get inputElems() {
    return this.shadowRoot?.querySelectorAll('.inputs-wrapper > input')
  }

  protected get messagesElem() {
    return this.shadowRoot?.querySelector('#message-tray')
  }

  protected get variable(): VarOrConstant | undefined {
    return this.parameters?.find(p => p.type === VarOrConstantTypeEnum.Var)
  }

  public get datatype() { return this.variable?.constantType }

  protected set datatype(value) {
    if (this.variable)
      this.variable.constantType = value
    this.parameters?.map(p => p.constantType = value)
    this.requestUpdate()
  }

  public get parametersIriOrConstants() {
    return this.parameters?.filter(p => p.type !== VarOrConstantTypeEnum.Var)
  }

  protected get formElement() {
    return this.shadowRoot?.querySelector('form')
  }

  protected get iriExamplesTable() {
    return this.shadowRoot?.querySelector('#query-results') as HTMLTableElement
  }

  protected get searchExamplesInput() {
    return this.shadowRoot?.querySelector('#search-examples-input') as HTMLInputElement
  }
}