# PrettyPHP for Visual Studio Code

## The opinionated formatter for modern, expressive PHP

This extension integrates the latest release of [PrettyPHP], a code formatter
for PHP by the same author, with Visual Studio Code.

> *PrettyPHP* hasn't reached a stable release yet, but its code style is
> unlikely to change significantly before v1.
>
> When *PrettyPHP*'s default output changes, settings to restore the previous
> behaviour are added to the extension if possible.

## Requirements

PHP 8+ must be installed.

## How is *PrettyPHP* different to other formatters?

From [PrettyPHP]'s FAQ (features still under development are temporarily
~~crossed out~~):

### It's opinionated

- No configuration is required
- Formatting options are deliberately limited
- Readable code, small diffs, and high throughput are the main priorities

### It's a formatter, not a fixer

- Previous formatting is ignored[^1]
- Whitespace is changed, code is not[^1]
- Entire files are formatted in place

[^1]: Some [pragmatic exceptions] are made.

### It's CI-friendly

- Installs via `composer require --dev lkrms/pretty-php` ~~or direct download~~
- Runs on Linux, macOS and Windows
- MIT-licensed

### It's safe

- Written in PHP
- Uses PHP's tokenizer to parse input and validate output
- Checks formatted and original code for equivalence by comparing language
  tokens returned by [`PhpToken::tokenize()`][tokenize].

### ~~It's optionally compliant with PSR-12 and other coding standards~~

*PrettyPHP* has partial support for [PSR-12]. An upcoming release will offer
full support.


[pragmatic exceptions]: https://github.com/lkrms/pretty-php#pragmatism
[PrettyPHP]: https://github.com/lkrms/pretty-php
[PSR-12]: https://www.php-fig.org/psr/psr-12/
[tokenize]: https://www.php.net/manual/en/phptoken.tokenize.php

