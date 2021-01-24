import { IconExtractor } from "../extractor";

export interface TemplateGenerator {
  write(
    targetPath: string,
    icons: string[],
    extractor: IconExtractor
  ): Promise<void>;
}

export { default as HugoGenerator } from "./hugo";
