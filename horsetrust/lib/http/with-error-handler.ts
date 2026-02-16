import { QueryFailedError } from "typeorm";
import { parseDatabaseError } from "../database/utils";
import { mapDatabaseErrorToAppError } from "../errors/error-mapper";
import { errorResponse, handleUnexpectedError } from "./response-handler";

export function withErrorHandler<
  TArgs extends unknown[],
  TReturn extends Response
>(
  handler: (...args: TArgs) => Promise<TReturn>
) {
  return async (...args: TArgs): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const dbError = parseDatabaseError(error);
        const appError = mapDatabaseErrorToAppError(dbError);
        return errorResponse(appError);
      }

      return handleUnexpectedError(error);
    }
  };
}
