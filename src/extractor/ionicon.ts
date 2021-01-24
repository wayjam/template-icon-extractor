import { IconExtractor } from "./index";
import ionicons from "ionicons/icons";
import camelCase from "camelcase";

interface icons {
  [index: string]: string;
}

class IonIconExtractor implements IconExtractor {
  toHTML(icon: string): Promise<string> {
    try {
      const svg = (ionicons as icons)[camelCase(icon)]
        .replace("data:image/svg+xml;utf8,", "")
        .replace(/<title>.*<\/title>/, "");
      console.log(`extraced icon ${icon}`);
      return Promise.resolve(svg)
    } catch (err) {
      console.log(`failed to extract ${icon}: ${err}`);
      return Promise.resolve("");
    }
  }
}

export default IonIconExtractor;
