import { IconExtractor } from "./index";
import feather from "feather-icons";

class FeatherExtractor implements IconExtractor {
  toHTML(icon: string): Promise<string> {
    try {
      const svg = feather.icons[icon].toSvg();
      console.log(`extraced icon ${icon}`);
      return Promise.resolve(svg);
    } catch (err) {
      console.log(`failed to extract ${icon}: ${err}`);
      return Promise.resolve("");
    }
  }
}

export default FeatherExtractor;
