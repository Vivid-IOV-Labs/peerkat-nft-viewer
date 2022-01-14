import * as clipboard from "clipboard-polyfill/text";
import { notify } from "@kyvg/vue3-notification";

// export async function copyText(text: string): Promise<void> {
//   await clipboard.writeText(text);
//   notify({
//     title: "info",
//     text: "Copied successfully",
//   });
// }
function copyTextValueOld(copyText: string) {
  const input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("value", copyText);
  input.setAttribute("type", "text");
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, 99999); /* For mobile devices */

  try {
    document.execCommand("copy");

    notify({
      title: "Copied successfully",
      type: "success",
    });
  } catch (err) {
    notify({
      title: "Not Copied",
      type: "error",
    });
  }
  /* unselect the range */
  input.setAttribute("type", "hidden");
  window?.getSelection()?.removeAllRanges();
}
export async function copyText(text: string): Promise<void> {
  try {
    await clipboard.writeText(text);
    notify({
      title: "Copied successfully",
      type: "success",
    });
  } catch (err) {
    await copyTextValueOld(text);
  }
}
