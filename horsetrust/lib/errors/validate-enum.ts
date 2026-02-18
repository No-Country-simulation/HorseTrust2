import { errorResponse } from "../http/response-handler"

export function validateEnumOrError<T extends Record<string, string>>(
  enumObject: T,
  value: unknown,
  fieldName: string,
  errorCode: string
) {
  const allowedValues = Object.values(enumObject)

  if (!allowedValues.includes(value as T[keyof T])) {
    return errorResponse({
      message: `${fieldName} inválido. Valores permitidos: ${allowedValues.join(", ")}`,
      code: errorCode,
      statusCode: 400,
      name: ""
    })
  }
}
