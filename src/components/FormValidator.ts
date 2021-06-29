import { reactive } from "@vue/reactivity";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default function useFormValidation(schema) {
  const refGields = reactive(schema);
  const rules = {
    title: { value: required },
    subtitle: { required },
    walletAddress: { required },
    mediaID: { required },
    moreInfo: { required },
    live: { required },
    earn: { required },
    highlighted: { required },
    order: { required },
    hashtags: { required },
  };
  const v$ = useVuelidate(rules, refGields);
  //.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  return { v$ };
}
