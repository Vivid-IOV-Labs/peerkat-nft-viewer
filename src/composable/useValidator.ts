import useVuelidate from "@vuelidate/core";
import { ValidationRuleCollection } from "@vuelidate/core";

function focusTo(id: string) {
  const el = document.getElementById(id);
  if (el?.focus) {
    el.focus({ preventScroll: false });
  }
}

export default function (
  formData: Record<string, any>,
  rules: ValidationRuleCollection
) {
  const v$ = useVuelidate(rules, formData, { $autoDirty: true });
  return {
    formData,
    v$,
    formatVuelidateErrors(errors: any[]) {
      return errors.map((error) => {
        return { text: error.$message, key: error.$uid };
      });
    },
    async validate(): Promise<boolean> {
      const isFormCorrect = await v$.value.$validate();
      if (!isFormCorrect) {
        const { $errors } = v$.value;
        const {
          0: { $property: firsInvalidEl } = { $property: null },
          length,
        } = $errors;
        if (firsInvalidEl) {
          focusTo(firsInvalidEl);
          return false;
        }
        return false;
      }
      return true;
    },
  };
}
