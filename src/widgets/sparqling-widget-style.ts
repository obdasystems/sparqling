import { css } from "lit";

export default css`
  .top-bar {
    font-size: 12px;
    display: flex;
    flex-direction: row;    
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    box-sizing: border-box;
    width: 100%;
    border-top-left-radius: var(--gscape-border-radius);
    border-top-right-radius: var(--gscape-border-radius);
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    background: var(--gscape-color-bg-inset);
  }

  .top-bar.traslated-down {
    top: unset;
    right: unset;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    width: fit-content;
    height: fit-content;
  }

  #widget-header {
    margin-left: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  #buttons-tray > * {
    position: initial;
  }

  #buttons-tray {
    display: flex;
    align-items: center;
    justify-content: end;
    flex-grow: 3;
    padding: 0 10px;
  }

  #buttons-tray > gscape-button {
    --gscape-icon-size: 20px;
  }

  #buttons-tray > input {
    max-width: 130px;
    margin: 0 5px;
    padding-right: 2px;
  }

  .gscape-panel {
    display: flex;
    flex-direction: column;
    width: unset;
    max-width: unset;
    height: 100%;
    box-sizing: border-box;
    overflow: unset;
    padding: 0;
  }

  .sparqling-blank-slate {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: unset;
    width: 100%;
    box-sizing: border-box;
  }

  [disabled] {
    cursor: not-allowed;
  }

  input:invalid, select:invalid {
    border-color: var(--gscape-color-danger);
    background-color: var(--gscape-color-danger-muted);
  }

  input:invalid:focus, select:invalid:focus {
    box-shadow: var(--gscape-color-danger) 0px 0px 0px 1px inset;
    border-color: var(--gscape-color-danger);
  }
`