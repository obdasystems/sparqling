import { FilterExpressionOperatorEnum, FunctionNameEnum, VarOrConstant } from "../api/swagger";

export interface FilterOrFunctionWidget {
  operator: FilterExpressionOperatorEnum | FunctionNameEnum,
  parameters: VarOrConstant[]
}