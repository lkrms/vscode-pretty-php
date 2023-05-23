# PrettyPHP for Visual Studio Code

## The opinionated formatter for modern, expressive PHP

This extension integrates the latest release of [PrettyPHP], a code formatter
inspired by [Black], with Visual Studio Code.

Like *Black*, *PrettyPHP* runs with sensible defaults and doesn't need to be
configured. It's also deterministic (with some [pragmatic exceptions]), so no
matter how the input is formatted, it produces the same output.

> *PrettyPHP*'s default output is unlikely to change significantly before
> [version 1.0.0] is released, but if you're already using it in production,
> pinning `lkrms/pretty-php` to a specific version is recommended.

## Requirements

*PrettyPHP* requires PHP 7.4, 8.0, 8.1, or 8.2 with a CLI runtime and the `phar`
and `mbstring` extensions.

The `json` and `tokenizer` extensions are also required, but they are usually
enabled by default.

## FAQ

### How is *PrettyPHP* different to other formatters?

#### It's opinionated

- No configuration is required
- Formatting options are deliberately limited
- Readable code, small diffs, and high throughput are the main priorities

#### It's a formatter, not a fixer

- Previous formatting is ignored
- Whitespace is changed, code is not
- Entire files are formatted in place

(Some [pragmatic exceptions] are made.)

#### It's CI-friendly

- Installs via `composer require --dev lkrms/pretty-php`
- Runs on Linux, macOS and Windows
- MIT-licensed

#### It's safe

- Written in PHP
- Uses PHP's tokenizer to parse input and validate output
- Checks formatted and original code for equivalence by comparing language
  tokens returned by [`PhpToken::tokenize()`][tokenize].

#### It's optionally compatible with coding standards

*PrettyPHP* has partial support for [PSR-12]. An upcoming release will offer
full support.

### Why are there so many options?

Because *PrettyPHP* is in initial development, PHP formatting is complicated,
and testing is easier when settings can be changed at runtime.

Over time, *PrettyPHP* will become more opinionated and have fewer options, so
reliance on formatting options is discouraged.


[Black]: https://github.com/psf/black
[pragmatic exceptions]: https://github.com/lkrms/pretty-php#pragmatism
[PrettyPHP]: https://github.com/lkrms/pretty-php
[PSR-12]: https://www.php-fig.org/psr/psr-12/
[tokenize]: https://www.php.net/manual/en/phptoken.tokenize.php
[version 1.0.0]: https://semver.org/#spec-item-5

