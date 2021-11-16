import * as clipboard from "clipboard-polyfill/text";
import { notify } from "@kyvg/vue3-notification";

export async function copyText(text: string): Promise<void> {
  await clipboard.writeText(text);
  notify({
    title: "info",
    text: "Copied successfully",
  });
}
