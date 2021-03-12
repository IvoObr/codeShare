import { ErrorType } from "@enums";

export class UserError extends Error {
  public type: ErrorType

  constructor(type: ErrorType) {
      super(type as unknown as string);
      this.type = type;
  }
}