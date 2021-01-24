#! /usr/bin/env node

import yargs from "yargs";
import path from "path";
import { TemplateParser, HugoParser } from "./parser";
import { TemplateGenerator, HugoGenerator } from "./generator";
import { IconExtractor, FeatherExtractor, IonIconExtractor } from "./extractor";

const argv: any = yargs
  .scriptName("tempalate-icon-extractor")
  .help("h")
  .option("s", {
    alias: "source",
    default: ".",
    describe: "template source dir"
  })
  .option("t", {
    alias: "type",
    choices: ["hugo"]
  })
  .option("o", {
    alias: "output"
  })
  .option("i", {
    alias: "icon",
    describe: "icon type",
    choices: ["fontawesome", "ionicon", "feather"]
  })
  .coerce(["source", "output"], path.resolve)
  .demandOption(["s", "output"]).argv;

function cli(source: string, output: string, type: string, icon: string) {
	console.debug(source, output, type, icon)
  let parser: TemplateParser;
  let generator: TemplateGenerator;
  let extractor: IconExtractor;

  if (type === "hugo") {
    parser = new HugoParser(source);
    generator = new HugoGenerator();
  }

  if (icon === "feather") {
    extractor = new FeatherExtractor();
  } else if (icon === "ionicon") {
    extractor = new IonIconExtractor();
  }


  parser!.scan().then(() => {
    const icons = parser.icons();
		generator.write(output, icons, extractor)
  });
}

cli(argv.source, argv.output, argv.type, argv.icon);
