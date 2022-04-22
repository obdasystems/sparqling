import { QueryGraphHeadApiFactory } from "../api/swagger";
import { handlePromise } from "../main/handle-promises";
import onNewBody from "../main/on-new-body";
import * as model from "../model";
import { aggregationDialog } from "../widgets";

aggregationDialog.onSubmit((headElementId, aggregateOperator, distinct, havingOperator, havingParameters) => {
  const qhApi = QueryGraphHeadApiFactory()
  const tempQueryBody = model.getTempQueryBody()
  
  const headElement = model.getHeadElementByID(headElementId as string, tempQueryBody)
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
  
  handlePromise(qhApi.aggregationHeadTerm(headElementId as string, tempQueryBody)).then(newBody => {
    onNewBody(newBody)
    aggregationDialog.setAsCorrect()
  })
})