# PrettyPHP for Visual Studio Code

## The opinionated code formatter for PHP

This extension integrates the latest release of [PrettyPHP], a code formatter
for PHP in the tradition of [Black] for Python, [Prettier] for JavaScript and
[shfmt] for shell scripts.

[PrettyPHP] aims to bring the benefits of fast, deterministic, minimally
configurable, automated code formatting tools to PHP development.

You can also use it as a standalone tool, add it to your CI workflows, or pair
it with a linter like [phpcbf] or [php-cs-fixer].

Or you could just give it a try 😉

## Features

- Previous formatting is ignored<sup>\*\*</sup>
- Whitespace is changed, code is not<sup>\*\*</sup>
- Output is the same no matter how input is formatted<sup>\*\*</sup>
- Code is formatted for:
  1. readability
  2. consistency
  3. small diffs
- Entire files are formatted in place
- Configuration is optional
- Formatting options are deliberately limited, workflow options are not
- Written in PHP
- Formats code written for PHP versions up to 8.2 (but see the [note about PHP
  versions][versions] below)
- Uses PHP's tokenizer to parse input and validate output
- Checks formatted and original code for equivalence
- Compliant with formatting-related [PSR-12] and [PER] requirements (when
  `formatting.psr12` is enabled; details [here][docs/PSR-12.md] and
  [here][PSR-12 issue])

<sup>\*\*</sup> Some [pragmatic exceptions] are made.

## Requirements

- Linux, macOS or Windows
- PHP 7.4, 8.0, 8.1 or 8.2 with a CLI runtime and the following extensions
  (enabled by default on most platforms):
  - `mbstring`
  - `json`
  - `tokenizer`

### A note about PHP versions

If your PHP runtime can parse your code, *PrettyPHP* can format it, so if
formatting fails with `"<file> cannot be parsed"` even though your syntax is
valid, run `php -v` to check your PHP version.

## License

MIT

## Support

You can ask a question, report a bug or request a feature by opening a [new
issue][new-issue] in the official *PrettyPHP* GitHub repository.


[Black]: https://github.com/psf/black
[new-issue]: https://github.com/lkrms/pretty-php/issues/new
[PER]: https://www.php-fig.org/per/coding-style/
[php-cs-fixer]: https://github.com/PHP-CS-Fixer/PHP-CS-Fixer
[phpcbf]: https://github.com/squizlabs/PHP_CodeSniffer
[pragmatic exceptions]: https://github.com/lkrms/pretty-php#pragmatism
[Prettier]: https://prettier.io/
[PrettyPHP]: https://github.com/lkrms/pretty-php
[PSR-12]: https://www.php-fig.org/psr/psr-12/
[PSR-12 issue]: https://github.com/lkrms/pretty-php/issues/4
[docs/PSR-12.md]: https://github.com/lkrms/pretty-php/blob/main/docs/PSR-12.md
[shfmt]: https://github.com/mvdan/sh#shfmt
[versions]: #a-note-about-php-versions
