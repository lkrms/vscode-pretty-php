# Changelog

All notable changes to the [PrettyPHP] extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.4.18] - 2023-08-07

### Added

- Add support for inline parameter attributes

### Changed

- Suppress hanging indents in `match` expressions
- Preserve blank lines between the arms of `match` expressions

### Fixed

- Fix header spacing issue caused by inconsistent handling of `?>` tags that double as statement terminators
- Fix edge case where multi-line anonymous class interface lists are not indented
- Fix PHP 7.4 issue where `T_ATTRIBUTE_COMMENT` may not be the last token on the line


## [0.4.17] - 2023-08-04

### Fixed

* Fix regression in `AddHangingIndentation`


## [0.4.16] - 2023-08-04

### Added

- Preserve newline after `throw`
- Add optional depth-first sort order for imports
  - Replace "Sort Imports" setting with "Sort Imports By" and migrate previous values
- Make heredoc indentation configurable
  - Replace "Indent Heredocs" setting with "Heredoc Indentation" and migrate previous values
- Add "Formatting: Psr12" setting
- Write messages to an output channel instead of `console`

### Changed

- Don't apply hanging indentation in unambiguous single-expression contexts
- Improve comment formatting
  - Normalise whitespace at the beginning and end of one-line C-style and docblock comments
  - Reindent text in multi-line comments to maintain original alignment
  - Expand leading tabs in comments to spaces (and unexpand leading spaces to tabs if using tabs for indentation)
  - Only treat comments indented by at least one space (relative to code in the same context) as continuations of
    comments beside code
  - Improve comment placement in `switch` structures
- Refactor "Align Lists"
  - Improve consistency by removing complex eligibility checks and problematic enforcement of newlines between items
  - Propagate alignment to adjacent code recursively and unconditionally, allowing structures like:
    ```php
    <?php
    [':', [$a,
           $b, $c], [$d, $e,
                     $f], [$g,
                           $h, $i]];
    ```
- Apply magic commas to `list` and other destructuring constructs, not just arrays and argument lists

### Fixed

- Detect more unary contexts
- Refactor block detection to fix alignment anomalies when PHP and markup are mixed


## [0.4.15] - 2023-07-13

### Changed

- Group alias/import statements by `use`, `use function`, `use const` for PSR-12 compliance (previous order was `use`,
  `use const`, `use function`)
- Sort trait imports
- Tighten the criteria for a DocBlock to follow a blank line
- Move every `->` in a multi-line method chain to a new line, including any before the first newline
- In `align-chains`, collapse the first object operator after tokens with fewer characters than a soft tab
- In `align-lists`, don't allow close bracket placement to be the only reason a list is not aligned, and refine the
  criteria for aligning lists with nested brackets
- Rewrite the `align-assignments` rule
  - Align multiple tokens per line
  - Vary context matching rules by token type, e.g. only align commas adjacent to comparable tokens over consecutive
    lines
  - Apply spacing to the previous or following token as needed, e.g. right-align numeric columns in data arrays
  - Allow aligned tokens to be separated by multiple lines when every inner line has a higher effective indentation
    level than the tokens
  - Ignore series of alignable tokens that would otherwise be split and aligned separately due to a disruption (e.g. a
    comment, or nested code at a lower indentation level)
  - Align statements in one-line `switch` cases (`preserve-one-line` must also be enabled)


## [0.4.14] - 2023-07-05

### Added

- Add initial support for the WordPress code style via command line option `--preset wordpress`

### Changed

- Improve support for attributes when running on PHP 7.4

### Removed

- Remove settings:

  - Formatting: Preserve Trailing Spaces
  - Formatting: One Line Arguments

### Fixed

- Fix undesirable output when preserving newlines between brackets

  ```php
  <?php
  // Input
  $a = $b->c
      ($d);

  // Output (before)
  $a = $b->c(
      $d
  );

  // Output (after)
  $a = $b->c($d);
  ```

- Fix issue where `if` in `else if` is treated as a new statement (fixes [#12](https://github.com/lkrms/pretty-php/issues/12))


## [0.4.12] - 2023-06-22

### Added

- Move all interfaces in `extends` and `implements` lists to their own line when the list spans multiple lines

### Changed

- Shorten empty class and function bodies to `{}` and move them to the previous line
- Improve formatting of anonymous classes and attributes
- Add a blank line between file-level docblocks and `declare` statements

### Fixed

- Many small bugs you probably hadn't noticed


## [0.4.11] - 2023-06-17

### Changed

- Improve handling of control structures where braced and unbraced bodies are combined and/or nested

### Fixed

- Fix possible exception when rules `align-lists` and `align-fn` are combined


## [0.4.8] - 2023-05-25

### Changed

- Improve formatting of chained method calls
- Ignore all but the last of any incompatible rules given on the command line
- Update `laravel` preset

### Fixed

- Fix issue where operators after `$object->{$property}` expressions are sometimes treated as unary operators
- Fix issue where `align-lists` adds newlines between method chain arguments
- Fix handling of one-line comments with a subsequent close bracket
- Add tests for idempotent output and fix issues subsequently detected in comment placement and the `align-fn` rule


## [0.4.7] - 2023-05-23

> You didn't miss anything—I've started releasing the extension with the same version number as *PrettyPHP* itself, and
> some versions of the formatter don't make it to the extension.

### Changed

- Reinstate support for PHP 7.4


## [0.4.6] - 2023-05-18

### Changed

- **Improve alignment with `<?php` tags.** The first cut of this feature adhered more closely to "move fast and break
  things" than intended. Runaway indentation has been fixed, and the formatter's heuristics now take the context of each
  `?>` ... `<?php` pair into account.

### Fixed

- Fix errors related to alternative syntax parsing
- Fix issue where strings with content other than valid UTF-8 sequences cannot be normalised
- Fix inconsistent union and intersection type formatting
- Suppress formatting of tokens between backticks


## [0.4.4] - 2023-05-16

### Changed

- Improve Windows support, including clearer feedback and instructions when PHP can't be found
- Update bundled [PrettyPHP] to v0.4.4. Highlights:

  - Tokens between indented `<?php` and `?>` tags are aligned with the opening tag (finally!)
  - Unicode sequences ("👍") are never encoded (`"\360\237\221\215"`) when simplifying strings (an environment
    configured with a UTF-8 locale was required previously)
  - End-of-line sequences are preserved by default (previous versions converted `CRLF` to `LF`, which made no difference
    to this extension but may have been a deal-breaker for command-line users)

### Removed

- Remove the "Formatter Path" setting because versions other than the bundled version of *PrettyPHP* are likely to
  introduce compatibility issues

### Fixed

- Fix PHP 8.0 issue where *PrettyPHP* reports `Your Composer dependencies require a PHP version ">= 8.1.0"`. Apologies
  for the packaging oversight.
- Fix regression where the "Format PHP without Preserving Newlines" command preserves newlines when a config file
  applies to the file being formatted


## [0.4.0] - 2023-04-28

### Added

Add settings:

- Formatting: Preserve Trailing Spaces
- Honour Configuration Files

### Changed

- Update bundled [PrettyPHP] to v0.4.1. Highlights:

  - Support for JSON configuration files (e.g. `.prettyphp`, `prettyphp.json`) that specify how files in and below a
    directory should be formatted
  - Optional preservation of Markdown-style line breaks (aka trailing spaces) in comments
  - Improved `match` handling


## [0.3.5] - 2023-04-04

### Changed

- Update bundled [PrettyPHP] to v0.3.22. Highlights:

  - Lists of interfaces after `extends` or `implements` are handled correctly
  - If one ternary operator is found at the start of a line, its counterpart is also moved to the start of a line
  - Improved chain alignment heuristics (apologies for any inexplicable whitespace diffs you encounter)
  - Nested heredocs no longer produce unparsable output


## [0.3.4] - 2023-03-28

### Changed

- Update documentation


## [0.3.3] - 2023-03-27

### Added

- Add settings:

  - Formatter Arguments
  - Formatting:

    - Sort Imports
    - Magic Commas
    - Indent Heredocs
    - Blank Before Return
    - Strict Lists
    - Alignment:

      - Align Chains
      - Align Fn
      - Align Lists
      - Align Ternary Operators

### Changed

- Suppress error notification when syntax is invalid
- Rename "Blank Before Declaration" setting to "Declaration Spacing"
- Update bundled [PrettyPHP] to v0.3.19. Highlights:

  - New alignment rules for ternary operators and arrow functions
  - Improved array and argument list handling
  - Many fixes and refinements


## [0.3.2] - 2023-03-14

### Added

- Add formatting setting: "One Line Arguments"

### Changed

- Update bundled [PrettyPHP] to v0.3.17, with fixes and heuristic improvements to hanging indentation, brace and newline
  placement, assignment alignment and unenclosed control structure body handling.


## [0.3.1] - 2023-03-07

### Added

- Add formatting settings:

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
- Add formatting settings (a few more to come):

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


[0.4.18]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.18
[0.4.17]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.17
[0.4.16]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.16
[0.4.15]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.15
[0.4.14]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.14
[0.4.12]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.12
[0.4.11]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.11
[0.4.8]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.8
[0.4.7]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.7
[0.4.6]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.6
[0.4.4]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.4
[0.4.0]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.4.0
[0.3.5]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.3.5
[0.3.4]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.3.4
[0.3.3]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.3.3
[0.3.2]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.3.2
[0.3.1]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.3.1
[0.3.0]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.3.0
[0.2.0]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.2.0
[0.1.7]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.1.7
[0.1.6]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.1.6
[0.1.5]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.1.5
[0.1.4]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.1.4
[PrettyPHP]: https://github.com/lkrms/pretty-php
