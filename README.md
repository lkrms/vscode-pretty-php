# PrettyPHP for Visual Studio Code

## The opinionated formatter for modern PHP

This extension integrates the latest release of [PrettyPHP], a code formatter
inspired by [Black], with Visual Studio Code.

Like Black, *PrettyPHP* has sensible defaults and doesn't need to be configured.
It's also deterministic (with some [pragmatic exceptions]), so no matter how
your code is formatted, it produces the same output.

## Requirements

- Linux, macOS or Windows
- PHP 7.4, 8.0, 8.1 or 8.2 with a CLI runtime and the following extensions:
  - `mbstring`
  - `json`
  - `tokenizer`

### A note about PHP versions

Your PHP runtime must be able to parse the code you're formatting, so if
*PrettyPHP* is running on PHP 7.4, for example, you won't be able to format code
that requires PHP 8.0. Similarly, to format PHP 8.1 code, *PrettyPHP* must be
running on PHP 8.1 or above. If formatting fails and your syntax is valid, check
your PHP version.

## FAQ

### How is *PrettyPHP* different to other formatters?

#### It's opinionated

- No configuration is required
- Formatting options are deliberately limited
- Readable code, small diffs, and fast batch processing are the main priorities

#### It's a formatter, not a fixer<sup>\*</sup>

- Previous formatting is ignored<sup>\*\*</sup>
- Whitespace is changed, code is not<sup>\*\*</sup>
- Entire files are formatted in place

<sup>\*</sup> No disrespect is intended to excellent tools like [phpcbf] and
[php-cs-fixer]. *PrettyPHP* augments these tools, much like Black augments
`pycodestyle`.

<sup>\*\*</sup> Some [pragmatic exceptions] are made.

#### It's CI-friendly

- Installs via `composer require --dev lkrms/pretty-php` or [direct
  download][download]
- Runs on Linux, macOS and Windows
- MIT-licensed

#### It's safe

- Written in PHP
- Uses PHP's tokenizer to parse input and validate output
- Checks formatted and original code for equivalence

#### It's (almost) PSR-12 compliant

Progress towards full compliance with the formatting-related requirements of
[PSR-12] can be followed [here][PSR-12 issue].

## Support

Please [submit an issue][new-issue] to report a bug, request a feature or ask
for help.

## License

MIT


[Black]: https://github.com/psf/black
[download]: https://github.com/lkrms/pretty-php/releases/latest/download/pretty-php.phar
[new-issue]: https://github.com/lkrms/pretty-php/issues/new
[php-cs-fixer]: https://github.com/PHP-CS-Fixer/PHP-CS-Fixer
[phpcbf]: https://github.com/squizlabs/PHP_CodeSniffer
[pragmatic exceptions]: https://github.com/lkrms/pretty-php#pragmatism
[PrettyPHP]: https://github.com/lkrms/pretty-php
[PSR-12]: https://www.php-fig.org/psr/psr-12/
[PSR-12 issue]: https://github.com/lkrms/pretty-php/issues/4
