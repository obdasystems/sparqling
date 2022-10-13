import { css, LitElement, PropertyValueMap, TemplateResult } from 'lit'
import { ui } from 'grapholscape'
import { FilterExpressionOperatorEnum, FunctionNameEnum, GroupByElementAggregateFunctionEnum, VarOrConstant, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from '../../api/swagger'
import { FormID, FormOperator, FormWidget } from '../../util/filter-function-interface'
import { checkmark, rubbishBin } from '../assets/icons'
import validateForm, { validateSelectElement } from './validate-form'
import formStyle from './form-style'
import sparqlingWidgetStyle from '../sparqling-widget-style'
import { queryResultTemplateStyle } from '../query-result-template'
import { QueryResult } from '../../main'
import { loadingSpinnerStyle } from '../loading-spinner'
import { ModalMixin } from '../util/modal-background'

export enum Modality {
  DEFINE = 'Define',
  EDIT = 'Edit'
}

export default class SparqlingFormDialog extends ModalMixin(ui.BaseMixin(LitElement)) implements FormWidget {
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
  protected seeExamplesCallback = () => { }
  public formTitle?: string

  public acceptExamples = false
  public examples?: QueryResult
  public loadingExamples = false

  static properties = {
    operator: { attribute: false },
    parameters: { attribute: false },
    modality: { attribute: false },
    datatype: { attribute: false },
    aggregateOperator: { attribute: false },
    examples: { attribute: false },
    loadingExamples: { attribute: false, type: Boolean },
    acceptExamples: { attribute: false, type: Boolean }
  }

  static styles = [
    ui.baseStyle,
    formStyle,
    queryResultTemplateStyle,
    loadingSpinnerStyle,
    sparqlingWidgetStyle
  ]

  protected handleSubmit() {
    if (this.formElement && validateForm(this.formElement)) {
      this.onValidSubmit()
    }
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
      seeExamplesButton.onclick = () => this.seeExamplesCallback()
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
      if (this.variable && !this.examples) {
        this.loadingExamples = true
        callback(this.variable)
      }
      else {
        // if examples are already present, then show/hide them
        this.iriExamplesTable.classList.toggle('hide')
      }
    }
  }

  protected onValidSubmit() {
    this.submitCallback(this._id, this.operator, this.parameters)
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

  get iriExamplesTable() {
    return this.shadowRoot?.querySelector('#query-results') as HTMLTableElement
  }
}