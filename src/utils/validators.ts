import { ethers } from "ethers";
import { helpers } from "@vuelidate/validators";
function validateAddress(value: any): boolean {
  return ethers.utils.isAddress(value);
}

export const isAddress = helpers.withMessage(
  "Not a Valid address",
  validateAddress
);
