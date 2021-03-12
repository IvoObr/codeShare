import { UserErrorType } from "@enums";

export class UserError extends Error {
  public type: UserErrorType

  constructor(type: UserErrorType, message: string = 'invalid data provided',) {
      super(message);
      this.type = type;
  }
}