import { Theme } from "grapholscape"
import { DisplayedNameType } from "../displayed-name-type"
import cy, { setStateDisplayedNameType, setLanguage } from "./cy"
import { updateDisplayedNames } from "./graph-manipulation"
import getStylesheet from "./style"

export function setDisplayedNameType(newDisplayedNameType: DisplayedNameType, newlanguage?: string) {
  setStateDisplayedNameType(newDisplayedNameType)
  if (newlanguage)
    setLanguage(newlanguage)
  updateDisplayedNames()
}

export function setTheme(newTheme: Theme) {
  cy.style(getStylesheet(newTheme))
}