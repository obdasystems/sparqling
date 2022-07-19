import { EntityNameType, GrapholscapeTheme } from "grapholscape"
import cy, { setStateDisplayedNameType, setLanguage } from "./cy"
import { updateDisplayedNames } from "./graph-manipulation"
import getStylesheet from "./style"

export function setDisplayedNameType(newDisplayedNameType: EntityNameType, newlanguage?: string) {
  setStateDisplayedNameType(newDisplayedNameType)
  if (newlanguage)
    setLanguage(newlanguage)
  updateDisplayedNames()
}

export function setTheme(newTheme: GrapholscapeTheme) {
  cy.style(getStylesheet(newTheme))
}