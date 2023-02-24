# PrettyPHP for Visual Studio Code

## The opinionated formatter for modern, expressive PHP

This extension integrates the latest release of [PrettyPHP][], a code formatter
for PHP by the same author, with Visual Studio Code.

> *PrettyPHP* hasn't reached a stable release yet, but its code style is
> unlikely to change significantly before v1.
>
> If *PrettyPHP*'s default output changes, settings to restore the previous
> behaviour will be added to the extension wherever possible.

## Requirements

PHP 8+ must be installed.

## How is PrettyPHP different to other formatters?

From [PrettyPHP][]'s FAQ (features still under development have been crossed
out):

<details>
  <summary>It's opinionated</summary>

  - No configuration is required
  - Formatting options are deliberately limited
  - Readable code, small diffs, and fast processing are the main priorities

</details>

<details>
  <summary>It ignores previous formatting (with some exceptions)</summary>

  - Whitespace is discarded before formatting
  - Entire files are formatted in place

</details>

<details>
  <summary>It doesn't make any changes to code (with some exceptions)</summary>
</details>

<details>
  <summary>It's CI-friendly</summary>

  - Installs via `composer require --dev` ~~or direct download~~
  - Runs on Linux, macOS and Windows
  - MIT-licensed

</details>

<details>
  <summary>It's written in PHP</summary>

  - Uses PHP to safely tokenize and validate code
  - Compares tokens before and after formatting for equivalence

</details>

<details>
  <summary><del>It's optionally compliant with PSR-12 and other coding standards</del></summary>
</details>

See the [PrettyPHP][] repository on GitHub for more information.


[PrettyPHP]: https://github.com/lkrms/pretty-php

