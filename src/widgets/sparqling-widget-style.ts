import { css } from "lit";

export default css`
  .top-bar {
    font-size: 12px;
    display: flex;
    flex-direction: row;
    line-height: 1;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    
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
  }

  .gscape-panel {
    width: unset;
    max-width: unset;
    height: 100%;
    box-sizing: border-box;
    overflow: unset;
    padding: 0;
    padding-top: 27px;
  }

  .blank-slate {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: unset;
    width: 100%;
    box-sizing: border-box;
  }
`