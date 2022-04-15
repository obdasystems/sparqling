import { css } from 'lit'

export function getElemWithOperatorStyle() {
  return css`
    .elem-with-operator {
      display: flex;
      gap: 10px;
      align-items:center;
      justify-content: center;
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

    .operator {
      font-weight:bold;
      font-size:110%;
    }

    .operator, .parameter {
      padding: 4px 6px;
      padding-bottom: 2px;
      border-radius: 6px;
      background-color: var(--theme-gscape-primary);
      color: var(--theme-gscape-on-primary);
      line-height: 1;
    }
  `
}