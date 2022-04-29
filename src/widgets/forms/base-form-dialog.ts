import { css } from 'lit'
import { UI } from 'grapholscape'
import { FilterExpressionOperatorEnum, FunctionNameEnum, GroupByElementAggregateFunctionEnum, VarOrConstant, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from '../../api/swagger'
import { FormID, FormOperator, FormWidget } from '../../util/filter-function-interface'
import { checkmark, rubbishBin } from '../assets/icons'

export const CLASS_FIELD_ERROR = css`field-error`
export enum Modality {
  DEFINE = 'Define',
  EDIT = 'Edit'
}

export type ValidationCheck = {
  name: string,
  errorMessage: string,
  getErrorElems: () => HTMLElement[],
}

export default class SparqlingFormDialog extends (UI.GscapeWidget as any) implements FormWidget {
  protected saveButton = new UI.GscapeButton(checkmark, "Save")
  protected deleteButton = new UI.GscapeButton(rubbishBin, "Delete")
  public operator: FormOperator
  public parameters: VarOrConstant[]
  public parametersType: VarOrConstantTypeEnum
  public _id: FormID
  public modality: Modality = Modality.DEFINE
  public aggregateOperator: GroupByElementAggregateFunctionEnum
  public variableName: string
  protected deleteCallback = (filterId: any) => { }

  protected validationChecks: ValidationCheck[]

  static get properties() {
    let props = super.properties
    // props.class = { attribute: false }
    // props.highlights = { attribute: false }
    props.operator = { attribute: false }
    props.parameters = { attribute: false }
    props.modality = { attribute: false }
    props.datatype = { attribute: false }
    props.aggregateOperator = { attribute: false }
    return props
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]
    return [
      super_styles[0],
      css`
        :host {
          position: absolute;
          top: 30%;
          left: 50%;
        }

        gscape-dialog {
          min-width: 300px;
        }

        .dialog-body {
          display: flex;
          flex-direction: column;
          gap: 30px;
          align-items: center;
        }

        .form, .inputs-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .selects-wrapper {
          align-self: start;
        }

        .inputs-wrapper {
          flex-direction: column;
        }

        .inputs-wrapper gscape-button {
          --gscape-icon-size: 18px;
        }

        gscape-button {
          position: initial;
          display: inline-block;
        }

        .${CLASS_FIELD_ERROR} {
          border-color: var(--theme-gscape-error);
        }

        #message-tray {
          font-size: 80%;
        }

        #message-tray > .correct-message {
          color: var(--theme-gscape-secondary);
        }

        #message-tray > .error-message {
          color: var(--theme-gscape-error);
        }

        .danger:hover {
          color: var(--theme-gscape-error, ${colors.error});
        }

        .bottom-buttons {
          display:flex;
          flex-direction:row-reverse;
          width: 100%;
          justify-content: space-between;
        }

        .section-header {
          text-align: center;
          font-weight: bold;
          border-bottom: solid 1px var(--theme-gscape-borders, ${colors.borders});
          color: var(--theme-gscape-secondary, , ${colors.secondary});
          width: 85%;
          margin: auto;
          margin-bottom: auto;
          margin-bottom: 10px;
          padding-bottom: 5px;
        }

        .input-elem {
          margin:5px;
        }
      `
    ]
  }

  constructor() {
    super()
    this.saveButton.onClick = () => this.handleSubmit()
    this.deleteButton.onClick = () => this.deleteCallback(this._id)
    this.deleteButton.classList.add('danger')

    this.validationChecks = [
      { name: 'isOperatorValid', errorMessage: 'Select operator', getErrorElems: () => [this.selectOperatorElem] },
      { name: 'isDatatypeValid', errorMessage: 'Select datatype', getErrorElems: () => [this.selectDatatypeElem] },
      { name: 'isAnyValueDefined', errorMessage: 'Input value not set', getErrorElems: () => this.emptyInputsValue }
    ]
  }

  protected setElemError(elem: HTMLElement) {
    elem.classList.add(CLASS_FIELD_ERROR.cssText)
  }

  protected handleSubmit(validationChecks = this.validationChecks) {
    this.resetMessages()
    let errorsFound = false

    validationChecks.forEach(validationCheck => {
      if (!this[validationCheck.name]) {
        errorsFound = true
        validationCheck.getErrorElems().forEach(erroElement => {
          this.setElemError(erroElement)
        })
        this.addMessage(validationCheck.errorMessage, 'error-message')
      }
    })

    if (!errorsFound) {
      this.resetErrors()
      this.onValidSubmit()
    }
  }

  private onOperatorChange(value: string) {
    this.operator = FilterExpressionOperatorEnum[value] || FunctionNameEnum[value]
    this.selectOperatorElem.classList.remove(CLASS_FIELD_ERROR.cssText)

    if (this.operator !== FilterExpressionOperatorEnum.In && this.operator !== FilterExpressionOperatorEnum.NotIn) {
      this.parameters.splice(2) // Only 2 parameters needed, discard others (remove from index=2 till end)
    } else {
      // IN and NOT IN needs at least 2 constants, so at least 3 parameters, variable + 2 constants
      if (this.parameters.length <= 2) {
        this.addInputValue()
      }
    }
  }

  private onDatatypeChange(value: string) {
    this.variable.constantType = VarOrConstantConstantTypeEnum[value]
    this.selectDatatypeElem.classList.remove(CLASS_FIELD_ERROR.cssText)
  }

  private onInputChange(index: number, value: string) {
    this.parameters[index].value = value

    if (value.length > 0) {
      this.innerDialog.querySelector(`[index = "${index}"]`).classList.remove(CLASS_FIELD_ERROR)
    }
  }

  show() {
    super.show()
    this.resetErrors()
    this.innerDialog.show()
  }

  hide() {
    super.hide()
    this.innerDialog.hide()
  }

  addInputValue() {
    this.parameters.push({
      type: this.parametersType,
      value: "",
      constantType: this.datatype
    });

    (this as any).requestUpdate()
  }

  updated() {
    super.updated()

    if (this.selectOperatorElem)
      this.selectOperatorElem.onchange = (e) => this.onOperatorChange(e.currentTarget.value)
    
    if (this.selectDatatypeElem)
      this.selectDatatypeElem.onchange = (e) => this.onDatatypeChange(e.currentTarget.value)

    this.inputElems?.forEach((input: any) =>
      input.onchange = (e) => this.onInputChange(input.getAttribute('index'), e.currentTarget.value)
    )

    const addInputButton: any = this.innerDialog.querySelector('#add-input-btn')
    if (addInputButton)
      addInputButton.onClick = () => this.addInputValue()

    if (this.parametersIriOrConstants?.length <= 0)
      this.addInputValue()
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

  resetErrors() {
    this.resetMessages()
    this.innerDialog.querySelectorAll(`.${CLASS_FIELD_ERROR}`).forEach((field: any) => {
      field.classList.remove(CLASS_FIELD_ERROR)
    })
  }

  setAsCorrect(customText?: string) {
    const text = customText || 'Correctly Saved'
    this.addMessage(text, 'correct-message')
    setTimeout(() => this.resetMessages(), 2000)
  }

  protected onValidSubmit() {
    this.submitCallback(this._id, this.operator, this.parameters)
  }

  protected get innerDialog() { return (this as any).shadowRoot.querySelector('gscape-dialog') }

  protected get selectOperatorElem() {
    return this.innerDialog.querySelector('#select-operator > select')
  }

  protected get selectDatatypeElem() {
    return this.innerDialog.querySelector('#select-datatype > select')
  }

  protected get inputElems() {
    return this.innerDialog.querySelectorAll('.inputs-wrapper > input')
  }

  protected get messagesElem() {
    return this.innerDialog.querySelector('#message-tray')
  }

  protected get variable(): VarOrConstant {
    return this.parameters?.find(p => p.type === VarOrConstantTypeEnum.Var)
  }

  protected get datatype() { return this.variable?.constantType }

  protected get parametersIriOrConstants() {
    return this.parameters?.filter(p => p.type !== VarOrConstantTypeEnum.Var)
  }

  protected get isOperatorValid() {
    let isFilterOperator = false
    let isFunctionOperator = false
    try {
      isFilterOperator = Object.values(FilterExpressionOperatorEnum).includes(this.operator as FilterExpressionOperatorEnum)
    } catch (e) { }

    try {
      isFunctionOperator = Object.values(FunctionNameEnum).includes(this.operator as FunctionNameEnum)
    } catch (e) { }

    return isFilterOperator || isFunctionOperator
  }

  protected get isDatatypeValid() {
    return this.parametersType === VarOrConstantTypeEnum.Iri || Object.values(VarOrConstantConstantTypeEnum).includes(this.datatype)
  }

  protected get isAnyValueDefined() {
    if (this.operator === FilterExpressionOperatorEnum.In || FilterExpressionOperatorEnum.NotIn) {
      return this.parameters.filter(p => p.value && p.type === VarOrConstantTypeEnum.Constant).length >= 2
    } else {
      return this.parameters.some(p => p.value && p.type !== VarOrConstantTypeEnum.Var )
    }
  }

  private get emptyInputsValue() {
    return Array.from(this.inputElems).filter((input: any) => !input.value)
  }
}