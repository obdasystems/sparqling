import { css } from "lit";

export default css`
  .gscape-panel {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0);
    height: unset;
  }

  .dialog-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    min-width: 350px;
    max-width: 450px;
    padding: 8px;
    margin-top: 8px;
    min-height: 150px;
    justify-content: space-between;
  }

  .form, .inputs-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .form {
    margin: 0 12px;
  }

  .selects-wrapper {
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .inputs-wrapper {
    flex-direction: column;
    overflow: auto;
    max-height: 260px;
    padding-right: 8px;
  }

  .inputs-wrapper gscape-button {
    --gscape-icon-size: 18px;
  }

  .bottom-buttons {
    display:flex;
    width: 100%;
    justify-content: end;
    gap: 4px;
  }

  .section-header {
    text-align: center;
    font-weight: bold;
    border-bottom: solid 1px var(--theme-gscape-borders);
    color: var(--theme-gscape-secondary);
    width: 85%;
    margin: auto;
    margin-bottom: auto;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }

  #message-tray {
    font-size: 90%;
  }
  #message-tray > .correct-message {
    color: var(--gscape-color-success);
  }
  #message-tray > .error-message {
    color: var(--gscape-color-danger);
  }

  form abbr {
    margin: 0 5px;
  }

  *:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`