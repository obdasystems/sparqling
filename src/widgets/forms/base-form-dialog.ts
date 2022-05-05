import { css } from 'lit'
import { UI } from 'grapholscape'
import { FilterExpressionOperatorEnum, FunctionNameEnum, GroupByElementAggregateFunctionEnum, VarOrConstant, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from '../../api/swagger'
import { FormID, FormOperator, FormWidget } from '../../util/filter-function-interface'
import { checkmark, rubbishBin } from '../assets/icons'

export enum Modality {
  DEFINE = 'Define',
  EDIT = 'Edit'
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

        #message-tray {
          font-size: 80%;
        }
        #message-tray > .correct-message {
          color: var(--theme-gscape-secondary);
        }
        #message-tray > .error-message {
          color: var(--theme-gscape-error);
        }

        .input-elem {
          color: inherit;
          margin:5px;
          padding: 5px;
          border: none;
          border-bottom: solid 1px;
        }

        form *:invalid {
          border-color: var(--theme-gscape-error);
        }

        form abbr {
          margin: 0 5px;
        }
      `
    ]
  }

  constructor() {
    super()
    this.saveButton.onClick = () => this.handleSubmit()
    this.deleteButton.onClick = () => this.deleteCallback(this._id)
    this.deleteButton.classList.add('danger')
  }

  protected handleSubmit() {
    if (this.formElement && this.formElement.reportValidity()) {
      this.onValidSubmit()
    }
  }

  private onOperatorChange(value: FilterExpressionOperatorEnum | FunctionNameEnum) {
    this.operator = value

    switch (this.operator) {
      case FilterExpressionOperatorEnum.In:
      case FilterExpressionOperatorEnum.NotIn:
        // IN and NOT IN needs at least 2 constants, so at least 3 parameters, variable + 2 constants
        if (this.parametersIriOrConstants.length < 2) {
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
        this.parameters.splice(1) // no parameters
        break;

      default:
        this.parameters.splice(2)
        if (this.parametersIriOrConstants.length <= 0) {
          this.addInputValue()
        }
    }
  }

  protected onDatatypeChange(value: VarOrConstantConstantTypeEnum) {
    this.datatype = value
  }

  private onInputChange(index: number, inputElem: HTMLInputElement) {
    if (this.datatype === VarOrConstantConstantTypeEnum.DateTime) {
      this.parameters[index].value = inputElem.valueAsDate.toISOString()
    } else {
      this.parameters[index].value = inputElem.value
    }
  }

  show() {
    super.show()
    this.innerDialog.show()
  }

  hide() {
    super.hide()
    this.innerDialog.hide()
  }

  addInputValue(number = 1) {
    for (let i = 0; i < number; i++) {
      this.parameters.push({
        type: this.parametersType,
        value: "",
        constantType: this.datatype
      })
    }

    (this as any).requestUpdate()
  }

  updated() {
    super.updated()

    if (this.selectOperatorElem)
      this.selectOperatorElem.onchange = (e) => this.onOperatorChange(e.currentTarget.value)

    if (this.selectDatatypeElem)
      this.selectDatatypeElem.onchange = (e) => this.onDatatypeChange(e.currentTarget.value)

    this.inputElems?.forEach((input: any) =>
      input.onchange = (e) => this.onInputChange(input.getAttribute('index'), e.currentTarget)
    )

    const addInputButton: any = this.innerDialog.querySelector('#add-input-btn')
    if (addInputButton)
      addInputButton.onClick = () => this.addInputValue()
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

  protected set datatype(value) {
    this.variable.constantType = value
    this.parameters.map(p => p.constantType = value)
    this.requestUpdate()
  }

  protected get parametersIriOrConstants() {
    return this.parameters?.filter(p => p.type !== VarOrConstantTypeEnum.Var)
  }

  protected get formElement(): HTMLFormElement {
    return this.innerDialog?.querySelector('form')
  }
}