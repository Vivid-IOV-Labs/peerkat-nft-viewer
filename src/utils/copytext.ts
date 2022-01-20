import * as clipboard from "clipboard-polyfill/text";
import { notify } from "@kyvg/vue3-notification";

// export async function copyText(text: string): Promise<void> {
//   await clipboard.writeText(text);
//   notify({
//     title: "info",
//     text: "Copied successfully",
//   });
// }
function copyTextValueOld(
  copyText: string,
  { title, text }: Record<string, string>
) {
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
      title,
      text,
      type: "success",
    });
  } catch (err) {
    notify({
      text: "Not Copied",
      title: "Share NFT link",
      type: "error",
    });
  }
  /* unselect the range */
  input.setAttribute("type", "hidden");
  window?.getSelection()?.removeAllRanges();
}
export async function copyText(
  copy: string,
  { title, text }: Record<string, string>
): Promise<void> {
  try {
    await clipboard.writeText(copy);
    notify({
      title,
      text,
      type: "success",
    });
  } catch (err) {
    await copyTextValueOld(copy, { title, text });
  }
}
