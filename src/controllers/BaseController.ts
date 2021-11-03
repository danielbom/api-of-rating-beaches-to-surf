import mongoose from 'mongoose';
import { Response } from 'express';
import { CustomValidation } from '@src/models/UserRepository';

export default abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    response: Response,
    error: mongoose.Error.ValidationError | Error,
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      response.status(clientErrors.code).send(clientErrors);
    } else {
      response.status(500).send({ code: 500, error: 'Something went wrong' });
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
}
