let lang = 'en'

export const emptyQueryMsg = (l = lang) => {
  const text = { en: 'Empty Query' }
  return text[l]
}

export const emptyHeadMsg = (l = lang) => {
  const text = { 
    en: 'Your query will output everything'
  }

  return text[l]
}

export const emptyHeadTipMsg = (l = lang) => {
  const text = {
    en: 'The query head is the output of your query\n\
and it seems like you have nothing in it yet.\n\n\
We don\'t think an empty query is what you want\n\
so your result now will be everything. \n\n\
You can choose what to see in output from the\n\
query graph, data properties (e.g. attributes)\n\
will automatically go in the query head.'
  }

  return text[l]
}

export const tipWhy = (l = lang) => {
  const text = {
    en: 'Why?',
    it: 'Perché?'
  }

  return text[l]
}

export const defaultSelectDialogTitle = (l = lang) => {
  const text = {
    en: 'Select Item',
    it: 'Seleziona un elemento'
  }

  return text[l]
}

export const classSelectDialogTitle = (l = lang) => {
  const text = {
    en: 'Select a Class',
    it: 'Seleziona una Classe'
  }

  return text[l]
}

export const commandAddHeadText = (l = lang) => {
  const text = {
    en: 'Add to Query Head',
    it: 'Aggiungi in Query Head'
  }

  return text[l]
}

export const commandDeleteText = (l = lang) => {
  const text = {
    en: 'Delete',
    it: 'Elimina'
  }

  return text[l]
}

export const commandAddFilterText = (l = lang) => {
  const text = {
    en: 'Add Filter',
    it: 'Aggiungi Filtro'
  }

  return text[l]
}