import { DatabaseError } from "../database/utils";
import { AppError } from "./AppError";

export function mapDatabaseErrorToAppError(error: DatabaseError): AppError {
  switch (error.code) {
    case 'DUPLICATE_ENTRY':
      return new AppError(409, 'DUPLICATE_ENTRY', error.message);

    case 'INVALID_REFERENCE':
      return new AppError(400, 'INVALID_REFERENCE', error.message);

    case 'MISSING_REQUIRED_FIELD':
      return new AppError(400, 'MISSING_REQUIRED_FIELD', error.message);

    case 'NOT_FOUND':
      return new AppError(404, 'NOT_FOUND', error.message);

    default:
      return new AppError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}
