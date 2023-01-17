export type SparqlingConfig = {
  countStar?: boolean,
  limit?: boolean,
  offset?: boolean,
  distinct?: boolean,
  aggregation?: boolean,
  filter?: boolean,
  function?: boolean,
}

let config: SparqlingConfig = {}

export function setConfig(newConfig: SparqlingConfig = {}) {
  config = newConfig
}

export function getConfig() {
    config
}

export function isConfigEnabled(configEntry: string) {
  return config[configEntry] !== false
}

export function clearConfig() {
  config = { }
}