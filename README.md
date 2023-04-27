# PrettyPHP for Visual Studio Code

## The opinionated formatter for modern, expressive PHP

This extension integrates the latest release of [PrettyPHP], a code formatter
for PHP by the same author, with Visual Studio Code.

> *PrettyPHP* is still in development and is yet to reach a stable release. Its
> code style is unlikely to change significantly before v1, and breaking changes
> are kept to a minimum. *PrettyPHP* v0.x releases are safe to use in production
> scenarios that accommodate these limitations.

## Requirements

PHP 8+ must be installed.

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


[pragmatic exceptions]: https://github.com/lkrms/pretty-php#pragmatism
[PrettyPHP]: https://github.com/lkrms/pretty-php
[PSR-12]: https://www.php-fig.org/psr/psr-12/
[tokenize]: https://www.php.net/manual/en/phptoken.tokenize.php

