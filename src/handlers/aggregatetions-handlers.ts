import { Filter } from "../api/swagger";
import { getTempQueryBody } from "../model";
import { aggregationDialog } from "../widgets";

aggregationDialog.onSubmit((headElementID, havingOperator, havingParameters, aggregateOperator) => {
  const having: Filter = {
    expression: {
      operator: havingOperator,
      parameters: havingParameters,
    }
  }

  const tempQueryBody = getTempQueryBody()
  tempQueryBody.having = having
  console.log(tempQueryBody)
  aggregationDialog.setAsCorrect()
})