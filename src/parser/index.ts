export interface TemplateParser {
  scan(): Promise<TemplateParser>;
  icons(): string[];
}

export { default as HugoParser } from "./hugo";
