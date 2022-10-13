import { ui } from "grapholscape";

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class IModalMixin {
  hide(): void
  show(): void
}

export const ModalMixin = <T extends Constructor<ui.IBaseMixin>>(superClass: T) => {

  class ModalMixinClass extends superClass {

    show() {
      super.show();
      (this as unknown as HTMLElement).style.zIndex = '2';
      showModalBackground();
    }

    hide() {
      super.hide();
      (this as unknown as HTMLElement).style.zIndex = '';
      hideModalBackground()
    }

  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return ModalMixinClass as unknown as Constructor<IModalMixin> & T
}

export const modalBackground = document.createElement('div')
modalBackground.style.cssText = `
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  filter: brightness(0.4);
  background: var(--gscape-color-bg-default);
  z-index: 1;
  opacity: 0.6;
  display: none;
`

export function showModalBackground() {
  modalBackground.style.display = 'initial'
}

export function hideModalBackground() {
  modalBackground.style.display = 'none'
}