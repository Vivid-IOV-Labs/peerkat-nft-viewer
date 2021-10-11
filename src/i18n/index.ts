import { createI18n } from "vue-i18n";
import locizer from "locizer";

const apiKey = import.meta.env.VITE_LOCIZE_API_KEY;
const projectId = import.meta.env.VITE_LOCIZE_PROJECT_ID;
const namespace = import.meta.env.VITE_LOCIZE_NAMESPACE;
locizer.init({
  projectId,
  apiKey,
});
export const i18n = createI18n({
  locale: locizer.lng,
  fallbackLocale: "en",
});
export const loadMessagesPromise = new Promise((resolve, reject) => {
  locizer.loadAll(
    namespace,
    (err: Record<string, string>, messages: Record<string, string>) => {
      if (err) return reject(err);
      Object.keys(messages).forEach((l) => {
        i18n.global.setLocaleMessage(l, messages[l]);
      });
      resolve(messages);
    }
  );
});

export function handleMissing(locale: string, key: string): void {
  if (!apiKey) return;
  if (locale !== locizer.referenceLng) return;
  locizer.add(namespace, key, key);
}
