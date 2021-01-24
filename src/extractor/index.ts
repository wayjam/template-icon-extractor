export interface IconExtractor {
  toHTML(icon: string): Promise<string>;
}

export { default as FeatherExtractor } from "./feather";
export { default as IonIconExtractor } from "./ionicon";
