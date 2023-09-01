<div align="center">

# PrettyPHP for Visual Studio Code

## The opinionated code formatter for PHP

> This extension integrates the latest release of [PrettyPHP][] with Visual
> Studio Code.

</div>

*PrettyPHP* is a code formatter for PHP in the tradition of [Black][] for
Python, [Prettier][] for JavaScript and [shfmt][] for shell scripts. It aims to
bring the benefits of fast, deterministic, minimally configurable, automated
code formatting tools to PHP development.

To that end, you can also use *PrettyPHP* as a standalone tool, or pair it with
a linter like [phpcbf][] or [php-cs-fixer][] and add it to your CI workflows.

Or you could just give it a try and [let me know what you think][discuss]. 😉

## Requirements

- PHP 7.4, 8.0, 8.1 or 8.2 with the standard `tokenizer`, `mbstring` and `json`
  extensions enabled

## Features

Code is formatted for

1. readability,
2. consistency, and
3. small diffs

and with a few [pragmatic exceptions][]:

- previous formatting is ignored
- whitespace is changed, code is not
- output is the same no matter how input is formatted

Also:

- Entire files are formatted in place
- Configuration is optional
- Formatting options are deliberately limited
- Uses PHP's tokenizer to parse input and validate output
- Checks formatted and original code for equivalence
- Supports code written for PHP versions up to 8.2 (when running on a PHP
  version that can parse it)
- Compliant with [PSR-12][] and [PER][] if "Formatting: Psr12" is enabled
  (details [here][docs/PSR-12.md] and [here][PSR-12 issue])

## License

MIT


[Black]: https://github.com/psf/black
[discuss]: https://github.com/lkrms/pretty-php/discussions
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
