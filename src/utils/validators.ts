import { ethers } from "ethers";
import rippleRegex from "ripple-regex";

import {
  required,
  email,
  sameAs,
  maxLength,
  minLength,
  helpers,
} from "@vuelidate/validators";

// export const isRequired = withI18nMessage(required)
// export const isEmail = withI18nMessage(email)
export const isRequired = required;
export const isEmail = email;
// export const isMaxLength = (value: number) => withI18nMessage(maxLength(value))
// export const isMinLength = (value: number) => withI18nMessage(minLength(value))
export const isMaxLength = (value: number) => maxLength(value);
export const isMinLength = (value: number) => minLength(value);
function validateAddress(value: any): boolean {
  return ethers.utils.isAddress(value);
}
export const isValidAddress = helpers.withMessage(
  "Not a Valid address",
  validateAddress
);

const contain2Numerics = helpers.regex(/(?=(.*\d){2})/);
export const isAtLeast2Numerics = helpers.withMessage(
  "Must contains at least 2 numbers",
  contain2Numerics
);

export const isSameAs = (refInput: string) =>
  helpers.withMessage("The password should match", sameAs(refInput));

function validateEtherAddress(value: any): boolean {
  return ethers.utils.isAddress(value);
}

export const isEtherAddress = helpers.withMessage(
  "Not a Valid address",
  validateEtherAddress
);

function validateRippleAddress(value: any): boolean {
  return rippleRegex().test(value) || !value;
}

export const isRippleAddress = helpers.withMessage(
  "Not a Valid address",
  validateRippleAddress
);
