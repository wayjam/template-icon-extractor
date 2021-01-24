# Icon Extractor for template

A small tool to generate inline-svg in template.

- Parser
- Extractor
- Generator

## Usage

```sh
Options:
      --version  Show version number                                   [boolean]
  -h             Show help                                             [boolean]
  -s, --source   template source dir                   [required] [default: "."]
  -t, --type                                                   [choices: "hugo"]
  -o, --output                                                        [required]
  -i, --icon     icon type        [choices: "fontawesome", "ionicon", "feather"]
```

### Hugo

After generated icon template, you can use it like:

```
{{ partial "icons" "logo-twitter" }}
```

## LICENSE

Released under the [MIT License](https://github.com/wayjam/template-icon-extractor/blob/master/LICENSE).
