import fs from "fs";
import { promisify } from "util";

import { IconExtractor } from "../extractor";

import { TemplateGenerator } from "./index";

const writeFile = promisify(fs.writeFile);

function wrapSvg(icon: string, svg: string): string {
  return `
    {{ if eq $icon "${icon}" }}
        ${svg}
    {{ end }}`;
}

class HugoGenerator implements TemplateGenerator {
  async write(targetPath: string, icons: string[], extractor: IconExtractor) {
    let tmpl: string = await HugoGenerator.iconsToHTML(icons, extractor);
    tmpl = tmpl.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, "").trim(); // remove useless space or br
    await writeFile(targetPath, tmpl);
    console.log("file has been saved to " + targetPath);
  }

  static iconsToHTML(
    icons: string[],
    extractor: IconExtractor
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      Promise.all(
        icons.map(
          (icon: string) =>
            new Promise((resolve, reject) => {
              extractor
                .toHTML(icon)
                .then(html => resolve([icon, html]))
                .catch(err => reject(err));
            })
        )
      )
        .then((results: any[]) =>
          resolve(
            results.reduce((acc: string, curr: string[]) => {
              const [icon, svg] = curr;
              return acc + wrapSvg(icon, svg);
            }, "{{ $icon := . }}\n")
          )
        )
        .catch(err => reject(err));
    });
  }
}

export default HugoGenerator;
