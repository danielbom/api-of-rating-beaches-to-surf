import mongoose from 'mongoose';
import { Response } from 'express';
import { CustomValidation } from '@src/models/UserRepository';
import Logger from '@src/Logger';
import ApiError, { APIError } from '@src/util/errors/ApiError';

export default abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    response: Response,
    error: mongoose.Error.ValidationError | Error,
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      this.sendErrorResponse(response, {
        code: clientErrors.code,
        message: clientErrors.error,
      });
    } else {
      Logger.error(error);
      this.sendErrorResponse(response, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }

  private handleClientErrors(error: mongoose.Error.ValidationError): {
    code: number;
    error: string;
  } {
    const duplicatedValidationErrors = Object.values(error.errors).filter(
      (err: any) => err?.kind === CustomValidation.DUPLICATED,
    );
    if (duplicatedValidationErrors.length > 0) {
      return { code: 409, error: error.message };
    }
    return { code: 422, error: error.message };
  }

  protected sendErrorResponse(response: Response, apiError: APIError) {
    response.status(apiError.code).send(ApiError.format(apiError));
  }
}
