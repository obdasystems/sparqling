import { QueryGraphHeadApi } from "../api/swagger";
import { showExamplesInForm } from "../main";
import { handlePromise } from "../main/handle-promises";
import onNewBody from "../main/on-new-body";
import * as model from "../model";
import { getGraphElementByID, getIri } from "../util/graph-element-utility";
import { aggregationDialog } from "../widgets";

aggregationDialog.onSubmit((headElementId, aggregateOperator, distinct, havingOperator, havingParameters) => {
  const qgHeadApi = new QueryGraphHeadApi(undefined, model.getBasePath())
  const tempQueryBody = model.getTempQueryBody()
  
  const headElement = model.getHeadElementByID(headElementId as string, tempQueryBody)
  if (headElement) {
    headElement.groupBy = {
      distinct: distinct,
      aggregateFunction: aggregateOperator
    }

    if (havingOperator && havingParameters) {
      headElement.having = [{
        expression: {
          operator: havingOperator,
          parameters: havingParameters,
        }
      }]
    }

    handlePromise(qgHeadApi.aggregationHeadTerm(headElementId as string, tempQueryBody, model.getRequestOptions())).then(newBody => {
      onNewBody(newBody)
      aggregationDialog.setAsCorrect()
    })
  }
})


aggregationDialog.onSeeExamples(async variable => {
  if (variable.value) {
    showExamplesInForm(variable.value, aggregationDialog)
  }
})