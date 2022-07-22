import { css } from 'lit'

export function getElemWithOperatorStyle() {
  return css`
    .elem-with-operator {
      display: flex;
      gap: 10px;
      align-items:center;
      justify-content: center;
      padding-left: 8px;
    }

    .parameters {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex-grow:2;
      min-width: 0;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .parameter {
      background: var(--gscape-color-neutral-subtle);
      padding: 4px;
      padding-bottom: 4px;
      padding-bottom: 1px;
      border-radius: var(--gscape-border-radius);
      border: solid 1px var(--gscape-color-border-subtle);
    }
  `
}