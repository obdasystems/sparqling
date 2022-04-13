import { Function, FunctionNameEnum } from "../../../api/swagger"
import { html, css } from 'lit'

export function getFunctionListTemplate(funct: Function) {
  if (!funct) return
  return html`
    <div class="elem-with-operator">
      <div
        class="operator"
        title="${Object.keys(FunctionNameEnum).find(k => FunctionNameEnum[k] === funct.name)}"
      >
        ${funct.name}</div>
      <div class="parameters">
        ${funct.parameters?.map((param, index) => {
          if (index === 0) return null
          return html`
            <div class="parameter">
              ${param.value}
            </div>
          `
        })}
      </div>
    </div>
  `
}