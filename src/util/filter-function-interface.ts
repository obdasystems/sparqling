import { FilterExpressionOperatorEnum, FunctionNameEnum, GroupByElementAggregateFunctionEnum, VarOrConstant } from "../api/swagger";

export type FormOperator = FilterExpressionOperatorEnum | FunctionNameEnum
export type FormID = string | number

export interface FormWidget {
  _id: FormID,
  operator: FormOperator,
  parameters: VarOrConstant[],
  aggregateOperator: GroupByElementAggregateFunctionEnum,
}