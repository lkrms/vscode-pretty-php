# Changelog

All notable changes to the [PrettyPHP] extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.3.1] - 2023-03-07

### Added

- Add formatting options:

  - Blank Before Declaration
  - Align Comments

### Changed

- Update bundled [PrettyPHP] to v0.3.13. Highlights (aside from bug fixes and performance improvements):

  - Newlines between declarations are more consistent, e.g. when formatting three or more consecutive `public const`
    declarations, the gap between the first two declarations is applied to the others.
  - 2 spaces instead of 4 are added between code and adjacent comments.

## [0.3.0] - 2023-02-24

> PHP 8+ is now required.

### Added

- Add command: "Format PHP without Preserving Newlines"
- Add formatting options (a few more to come):

  - Simplify Strings
  - Align Assignments
  - Preserve One Line Statements

### Changed

- Update [PrettyPHP] to v0.3.6. Highlights:

  - v0.3.6 is 54% faster than v0.2.0, give or take.
  - Alias/import statements are grouped by type (`use`, `use const`, `use function`) and sorted.
  - Entire control structures are regarded as one statement, e.g. when preserving one-line statements.
  - Hanging indentation is applied to heredocs.
  - Newlines are added between items in lists that have a trailing comma.
  - Ternary operator detection and indentation is more robust.
  - Multiple issues have been resolved, including:

    - Inconsistent formatting of control structures with missing braces
    - Inconsistent detection of `do ... while` blocks
    - Undesirable blank lines above some PHPDoc comments
    - Undesirable alignment of multi-line comments beside code

## [0.2.0] - 2023-02-06

### Changed

- Update [PrettyPHP] to v0.2.0. Highlights:

  - Newlines are added before `->` or `?->` operators that appear after an aligned call in a method chain.
  - Newlines are added before items in argument lists and arrays where one or more items already have a leading newline.
  - Multi-line comments are supported beside code.
  - Standard multi-line comments (`/* ... */`) are formatted like their PHPDoc counterparts (`/** ... */`).
  - Multiple bugs related to indentation and alignment have been fixed.

## [0.1.7] - 2023-01-27

### Changed

- Update [PrettyPHP] to v0.1.10 for improved argument alignment and related bug fixes.

## [0.1.6] - 2023-01-25

### Added

- Add a formatter path setting for integration with custom versions of [PrettyPHP].

### Changed

- Update [PrettyPHP] to v0.1.8. Fixes an issue where subsequent empty lines weren't truncated correctly in heredocs.
- Rename `pretty-php.php` setting to `pretty-php.phpPath`.
- Report errors via VSCode notifications.

## [0.1.5] - 2023-01-23

### Added

- Add PHP executable path setting.

### Changed

- Update [PrettyPHP] to v0.1.6.
- Pass the active editor's indentation options to [PrettyPHP].
- Log output written to STDERR to the developer console even if no error occurs.
- Allow code being formatted to use PHP's short open tag (`<?`).

### Fixed

- Fix PHP startup errors appearing in formatted code.

## [0.1.4] - 2023-01-20

- Initial release


[0.3.1]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.3.1
[0.3.0]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.3.0
[0.2.0]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.2.0
[0.1.7]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.1.7
[0.1.6]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.1.6
[0.1.5]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.1.5
[0.1.4]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.1.4
[PrettyPHP]: https://github.com/lkrms/pretty-php
