import { UserErrors } from "@enums";

export class UserError extends Error {
  public type: UserErrors

  constructor(type: UserErrors, message: string,) {
      super(message);
      this.type = type;
  }
}