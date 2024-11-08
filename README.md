# pretty-php: the opinionated code formatter for Visual Studio Code

> This extension integrates the latest release of [pretty-php][] with VS Code.

<p>
  <a href="https://packagist.org/packages/lkrms/pretty-php"><img src="https://poser.pugx.org/lkrms/pretty-php/v" alt="Latest Stable Version" /></a>
  <a href="https://packagist.org/packages/lkrms/pretty-php"><img src="https://poser.pugx.org/lkrms/pretty-php/license" alt="License" /></a>
  <a href="https://github.com/lkrms/pretty-php/actions"><img src="https://github.com/lkrms/pretty-php/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
  <a href="https://codecov.io/gh/lkrms/pretty-php"><img src="https://codecov.io/gh/lkrms/pretty-php/graph/badge.svg?token=W0KVZU718K" alt="Code Coverage" /></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=lkrms.pretty-php"><img src="https://img.shields.io/visual-studio-marketplace/i/lkrms.pretty-php?label=Marketplace%20installs&color=%230066b8" alt="Visual Studio Marketplace install count" /></a>
  <a href="https://open-vsx.org/extension/lkrms/pretty-php"><img src="https://img.shields.io/open-vsx/dt/lkrms/pretty-php?label=Open%20VSX%20downloads&color=%23a60ee5" alt="Open VSX Registry download count" /></a>
</p>

---

`pretty-php` is a fast, deterministic, minimally configurable code formatter for
PHP.

By taking responsibility for the whitespace in your code, `pretty-php` makes it
easier to focus on the content, providing time and mental energy savings that
accrue over time.

Code formatted by `pretty-php` produces the smallest diffs possible and looks
the same regardless of the project you're working on, eliminating visual
dissonance and improving the speed and effectiveness of code review.

Aside from running it in VS Code, you can use `pretty-php` as a standalone tool,
pair it with a linter, or add it to your CI workflows. Configuration is optional
in each case.

If you have questions or feedback, I'd love to [hear from you][discuss].

> `pretty-php` isn't stable yet, so updates may introduce formatting changes
> that affect your code.

## Features

- Supports code written for **PHP 8.3** and below (when running on a PHP version
  that can parse it)
- Code is formatted for **readability**, **consistency** and **small diffs**
- With few [exceptions](#pragmatism), **previous formatting is ignored**, and
  nothing in the original file other than whitespace is changed
- Entire files are formatted in place
- Formatting options are deliberately limited (`pretty-php` is opinionated so
  you don't have to be)
- Configuration via a simple JSON file is supported but not required
- PHP's embedded tokenizer is used to parse input and validate output
- Formatted and original code are compared for equivalence
- Output is optionally compliant with [PSR-12][] and [PER][] (details
  [here][docs/PSR-12.md] and [here][PSR-12 issue])

## Configuration

To configure `pretty-php`, you can use the extension's VS Code settings, or you
can add a configuration file to your project.

**VS Code settings are ignored if an applicable `.prettyphp` or `prettyphp.json`
file is found.**

To create a configuration file based on your current VS Code settings, use the
extension's "Create .prettyphp or prettyphp.json" command. The bundled JSON
schema for `pretty-php` configuration files makes them easy to edit in VS Code:

![.prettyphp file IntelliSense](images/json-schema-screenshot.png)

More information about configuring `pretty-php` is available
[here][configuration].

### Examples

#### Minimal

```json
{
  "src": ["."]
}
```

- Enforce the default code style
- Format `*.php` files in the directory and its descendants

#### PSR-12 compliant

```json
{
  "src": ["bin", "src", "tests/unit", "bootstrap.php"],
  "includeIfPhp": true,
  "psr12": true
}
```

- Enforce the default code style
- Enable strict PSR-12/PER compliance
- Format `*.php` files, and files with no extension that appear to be PHP files,
  in the `bin`, `src` and `tests/unit` directories and their descendants
- Format `bootstrap.php`

## Requirements

- PHP 8.3, 8.2, 8.1, 8.0 or 7.4 with the standard `tokenizer`, `mbstring` and
  `json` extensions enabled

## Pragmatism

`pretty-php` generally abides by its own rules ("previous formatting is ignored,
and nothing in the original file other than whitespace is changed"), but
exceptions are occasionally made and documented here.

- **Newlines are preserved** \
  Line breaks adjacent to most operators, delimiters and brackets are copied from
  the input to the output.

  To suppress this behaviour temporarily, use the "Format PHP without Preserving
  Newlines" command.

- **Strings and numbers are normalised** \
  Single-quoted strings are preferred unless the alternative is shorter or backslash
  escapes are required.

  Use the "Formatting: Simplify Strings" and "Formatting: Simplify Numbers"
  settings to disable or modify this behaviour.

- **Alias/import statements are grouped and sorted alphabetically** \
  The "Formatting: Sort Imports By" setting can be used to disable or modify this
  behaviour.

- **Comments are moved if necessary for correct placement of adjacent tokens** \
  Turn the "Formatting: Move Comments" setting off to disable this behaviour.

- **Comments beside code are not moved to the next line**

- **Comments are trimmed and aligned**

- **Empty DocBlocks are removed**

## License

MIT

[configuration]:
  https://github.com/lkrms/pretty-php/blob/main/docs/Usage.md#configuration
[discuss]: https://github.com/lkrms/pretty-php/discussions
[PER]: https://www.php-fig.org/per/coding-style/
[pretty-php]: https://github.com/lkrms/pretty-php
[PSR-12]: https://www.php-fig.org/psr/psr-12/
[PSR-12 issue]: https://github.com/lkrms/pretty-php/issues/4
[docs/PSR-12.md]: https://github.com/lkrms/pretty-php/blob/main/docs/PSR-12.md
