import * as model from '../../model';
import { MastroEndpoint } from "../../model";
import { startRunButtons } from "../../widgets";

export default async function (callback: (selectedEndpoint: MastroEndpoint | undefined) => void) {
  let endpoint: MastroEndpoint | undefined

  await model.updateEndpoints()

  if (await model.isSelectedEndpointRunning()) {
    callback(model.getSelectedEndpoint())
    return
  }

  if (model.getEndpoints().length > 1) {
    endpoint = await startRunButtons.requestEndpointSelection()
    callback(endpoint)
    return
  }

  callback(undefined)
}
