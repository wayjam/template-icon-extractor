import { TemplateParser } from "./index";
import { Parser as htmlparser } from "htmlparser2";
import fs from "fs";
import path from "path";

class HugoParser implements TemplateParser {
  _icons: Set<string>;
  templatePath: string;
  parser: htmlparser;
  static re = new RegExp(/partial "utils\/icons[\.html]?" ["']([\w-_]+)['"]/);

  constructor(templatePath: string) {
    this._icons = new Set();
    this.templatePath = templatePath;
    this.parser = new htmlparser({
      ontext: text => {
        const result = HugoParser.re.exec(text);
        if (result && result.length > 1) {
          const icon = result[1];
          this._icons.add(icon);
        }
      }
    });
  }

  async scan(): Promise<TemplateParser> {
    try {
      const toScan = await HugoParser.scanDir(this.templatePath, this.parser);
      await Promise.all(toScan);
    } catch (err) {
      console.log("parse source error", err);
    }

    return this;
  }

  icons(): string[] {
    return Array.from(this._icons).sort();
  }

  clear(): void {
    this._icons.clear();
  }

  static scanDir(dir: string, htmlparser: htmlparser): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) {
          return reject(err);
        }
        const promises = files.map(fileName => {
          const filePath = path.join(dir, fileName);
          return HugoParser.scan(filePath, htmlparser);
        });
        Promise.all(promises).then(values => {
          resolve(
            values.reduce((acc, curr) => {
              return [...acc, ...curr];
            }, [])
          );
        });
      });
    });
  }

  static scan(targetPath: string, parser: htmlparser): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.stat(targetPath, function(err, stats) {
        if (err) {
          return reject(err);
        }
        if (stats.isDirectory()) {
          return resolve(HugoParser.scanDir(targetPath, parser));
        } else {
          if (path.extname(targetPath) === ".html") {
            const result = HugoParser.parseFile(targetPath, parser);
            return resolve([result]);
          }
        }
        resolve([]);
      });
    });
  }

  static parseFile(filePath: string, htmlparser: htmlparser): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
        if (err) {
          return reject(err);
        }
        htmlparser.write(data);
        htmlparser.end();
        resolve();
      });
    });
  }
}

export default HugoParser;
