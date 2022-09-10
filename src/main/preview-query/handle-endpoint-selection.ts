import { MastroEndpoint } from "../../model";
import * as model from '../../model'
import { attachCxtMenuTo, cxtMenu, cxtMenuWidget } from "../../widgets";

export default async function (targetElement: HTMLElement | undefined, callback: (selectedEndpoint: MastroEndpoint | undefined) => void) {
  let endpoint: MastroEndpoint | undefined
  if (!targetElement) return

  await model.updateEndpoints()

  if (model.getEndpoints().length <= 0) {
    callback(undefined)
    return
  }

  if (model.getEndpoints().length === 1) {
    // pick the first and only one in the updated list
    model.setSelectedEndpoint(model.getEndpoints()[0])
    endpoint = model.getSelectedEndpoint()

    if (endpoint) callback(endpoint)
  } else {
    const endpointSelectionCommands = model.getEndpointsCxtMenuCommands(callback) // callback will be called on selection
    cxtMenuWidget.title = 'Endpoint Selection'
    attachCxtMenuTo(targetElement, endpointSelectionCommands)
  }
}