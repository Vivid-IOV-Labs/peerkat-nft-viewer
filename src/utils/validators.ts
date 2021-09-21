import { ethers } from "ethers";
import { helpers } from "@vuelidate/validators";
import rippleRegex from "ripple-regex";

function validateEtherAddress(value: any): boolean {
  return ethers.utils.isAddress(value);
}

export const isEtherAddress = helpers.withMessage(
  "Not a Valid address",
  validateEtherAddress
);

function validateRippleAddress(value: any): boolean {
  return rippleRegex().test(value);
}

export const isRippleAddress = helpers.withMessage(
  "Not a Valid address",
  validateRippleAddress
);
