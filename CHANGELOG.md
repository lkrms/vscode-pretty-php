# Changelog

Notable changes to this extension and to [pretty-php] itself are documented in this file.

The format is based on [Keep a Changelog].

[pretty-php]: https://github.com/lkrms/pretty-php
[Keep a Changelog]: https://keepachangelog.com/en/1.1.0/

## [v0.4.24] - 2023-09-09

#### Changed

- Remove `T_BAD_CHARACTER` tokens
- Unescape leading tabs in strings when using tabs for indentation

## [v0.4.23] - 2023-09-06

#### Changed

- Improve performance by removing unnecessary type checking

## [v0.4.22] - 2023-08-31

#### Changed

- Adjust preservation of line breaks and blank lines

  - Don't preserve newlines after close braces that aren't structural (where "structural" essentially means "may enclose statements")
  - Collapse blank lines between list items and in other expression contexts (e.g. `for` loop expressions), including before comments
  - If one expression in a `for` loop is at the start of a line, add a newline before the others

- Don't sort `use <trait>` statements

  Changing the order of traits inserted into a class changes the order its members are reported, so behaviour removed in v0.4.15 has been restored

- When sorting imports, don't treat one-line comments as continuations if there is a change of type

- If chained method calls would render as below, move the first call in the chain to the next line:

  ```php
  // Before
  $foxtrot->foo(
      //
  )
      ->baz();

  // After
  $foxtrot
      ->foo(
          //
      )
      ->baz();
  ```

## [v0.4.21] - 2023-08-31

#### Changed

- Change default sort order of alias/import statements to depth-first
  - To restore the previous behaviour, use `--sort-imports-by name` or set "Sort Imports By" to "name"
- When sorting by name, don't place grouped alias/import statements below ungrouped imports
- Collapse space after `;` in `for` loops if the next expression is empty
- Preserve newlines before and after attributes
- Add a newline before every parameter, not just annotated parameters, when splitting parameter lists to accommodate attributes

#### Fixed

- Fix issue where blocks that start with an empty statement (e.g. `function () { ; // ...`) are not indented correctly
- Fix issue where anonymous class declarations are not always recognised
- Fix issue where newlines are added after inline comments between control structure tokens, leading to unnecessary indentation
- Fix issue where arrow function alignment fails in strict PSR-12 mode
- Fix `align-lists` issue where list items appearing consecutively on the same line are not always aligned correctly

## [v0.4.20] - 2023-08-24

#### Changed

- Remove "Magic Commas" setting
- Rename "Align Assignments" setting to "Align Data"

### pretty-php [v0.4.20][lkrms/pretty-php v0.4.20]

#### Fixed

- Downgrade Box to fix an issue where `pretty-php.phar` fails with an exception on Windows

## [v0.4.19] - 2023-08-11

> pretty-php for Visual Studio Code v0.4.19 was not released

#### Added

- Add `symfony` preset (CLI only)

#### Changed

- Make `magic-commas` rule mandatory and remove it from command line options
- Rename `align-assignments` rule to `align-data`
- Adopt Box for cleaner, leaner PHAR builds
- Remove upper limit on PHP version to allow running on PHP 8.3
- Suppress `E_COMPILE_WARNING` errors (they can't be caught or actioned, don't affect output and aren't user-friendly)

#### Fixed

- Fix issue where hanging indentation is not consistent within lists

  e.g. `'e'` should be aligned with `'g'` here:

  ```php
  <?php
  $a = array('b' => array('c' => 'd',
              'e' => 'f',
          'g' => 'h'),
      'i' => array(1,
          2,
          3),
      'j' => array('k',
          7 => 'l',
          'm'));
  ```

## [v0.4.18] - 2023-08-07

#### Added

- Add support for inline parameter attributes

#### Changed

- Suppress hanging indents in `match` expressions
- Preserve blank lines between the arms of `match` expressions

#### Fixed

- Fix header spacing issue caused by inconsistent handling of `?>` tags that double as statement terminators
- Fix edge case where multi-line anonymous class interface lists are not indented
- Fix PHP 7.4 issue where `T_ATTRIBUTE_COMMENT` may not be the last token on the line

## [v0.4.17] - 2023-08-04

#### Fixed

- Fix hanging indentation regression

## [v0.4.16] - 2023-08-04

#### Added

- Add "Psr12" setting
- Write messages to an output channel instead of `console`

#### Changed

- Replace "Sort Imports" setting with "Sort Imports By"
- Replace "Indent Heredocs" setting with "Heredoc Indentation"
- Migrate previous values of replaced settings

### pretty-php [v0.4.16][lkrms/pretty-php v0.4.16]

#### Added

- Preserve newline after `throw`
- Add optional depth-first import sort order (available via `--sort-imports-by`)
- Make heredoc indentation configurable via `--heredoc-indent`
- Add `--operators-first` and `--operators-last` flags (CLI only)
- Apply strict PSR-12 `<?php declare...` formatting and heredoc indentation when `--psr12` is given (CLI only)

#### Changed

- Don't apply hanging indentation in unambiguous single-expression contexts
- Improve comment formatting
  - Normalise whitespace at the beginning and end of one-line C-style and docblock comments
  - Reindent text in multi-line comments to maintain original alignment
  - Expand leading tabs in comments to spaces (and unexpand leading spaces to tabs if using tabs for indentation)
  - Only treat comments indented by at least one space (relative to code in the same context) as continuations of comments beside code
  - Improve comment placement in `switch` structures
- Refactor `align-lists`
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
- Expand WordPress preset
- Optimize for improved performance (in a 200-file batch test, v0.4.16 is 17% faster than with v0.4.15)

#### Removed

- Remove `one-line-arguments` from available rules
- Remove `--disable indent-heredocs` (replaced with `--heredoc-indent none`)

#### Fixed

- Detect more unary contexts
- Refactor block detection to fix alignment anomalies when PHP and markup are mixed

## [v0.4.15] - 2023-07-13

#### Changed

- Group alias/import statements by `use`, `use function`, `use const` for PSR-12 compliance (previous order was `use`, `use const`, `use function`)
- Sort trait imports
- Tighten the criteria for a DocBlock to follow a blank line
- Move every `->` in a multi-line method chain to a new line
- In `align-chains`, collapse the first object operator after tokens with fewer characters than a soft tab
- In `align-lists`, don't allow close bracket placement to be the only reason a list is not aligned, and refine the criteria for aligning lists with nested brackets
- Rewrite the `align-assignments` rule
  - Align multiple tokens per line
  - Vary context matching rules by token type, e.g. only align commas adjacent to comparable tokens over consecutive lines
  - Apply spacing to the previous or following token as needed, e.g. right-align numeric columns in data arrays
  - Allow aligned tokens to be separated by multiple lines when every inner line has a higher effective indentation level than the tokens
  - Ignore series of alignable tokens that would otherwise be split and aligned separately due to a disruption (e.g. a comment, or nested code at a lower indentation level)
  - Align statements in one-line `switch` cases (`preserve-one-line` must also be enabled)

#### Removed

- Remove "preserve trailing spaces" option
- Don't report unnecessary parentheses

#### Fixed

- Track and report output position to fix inaccurate problem report locations

## [v0.4.14] - 2023-07-05

#### Removed

- Remove "Preserve Trailing Spaces", "One Line Arguments" settings

### pretty-php [v0.4.14][lkrms/pretty-php v0.4.14]

#### Added

- Add initial support for the WordPress code style via `--preset wordpress` (CLI only)

#### Changed

- Improve support for attributes when running on PHP 7.4

#### Fixed

- Fix issue where `if` in `else if` is treated as a new statement

## [v0.4.13] - 2023-06-29

> pretty-php for Visual Studio Code v0.4.13 was not released

#### Removed

- Remove Laravel-specific formatting rules (`--preset laravel` output is unchanged):
  - `space-after-fn`
  - `space-after-not`
  - `no-concat-spaces`

#### Fixed

- Fix undesirable output when preserving newlines between brackets

  Previously:

  ```php
  <?php
  $a = $b->c
      ($d);
  ```

  Became:

  ```php
  $a = $b->c(
      $d
  );
  ```

  And with `--preset laravel`, this:

  ```php
  <?php
  function a($b)
  {
      c();
  }
  ```

  Became:

  ```php
  <?php
  function a($b
  ) {
      c();
  }
  ```

- Fix issue where indentation settings are not printed by `--print-config`

## [v0.4.12] - 2023-06-22

#### Added

- When a list of interfaces after `extends` or `implements` spans multiple lines, move every interface to its own line

#### Changed

- Shorten empty class and function bodies to `{}` and move them to the previous line
- Improve formatting of anonymous classes and attributes
- Add a blank line between file-level docblocks and `declare` statements

#### Fixed

- Many small bugs you probably hadn't noticed

## [v0.4.11] - 2023-06-16

#### Changed

- Improve handling of control structures where braced and unbraced bodies are combined and/or nested

#### Fixed

- Fix possible exception when "Align Lists" and "Align Fn" are combined

## [v0.4.10] - 2023-06-15

> pretty-php for Visual Studio Code v0.4.10 was not released

#### Changed

- Update dependencies

## [v0.4.9] - 2023-06-06

> pretty-php for Visual Studio Code v0.4.9 was not released

#### Fixed

- Fix issue where config files above the working directory are not found
- Fix issue where invalid or empty config files trigger an unrelated exception

## [v0.4.8] - 2023-05-25

#### Changed

- Improve formatting of chained method calls
- Ignore all but the last of any incompatible rules given on the command line
- Update `laravel` preset (CLI only)

#### Fixed

- Fix issue where operators after `$object->{$property}` expressions are sometimes treated as unary operators
- Fix issue where "Align Lists" adds newlines between method chain arguments
- Fix handling of one-line comments with a subsequent close bracket
- Add tests for idempotent output and fix issues subsequently detected in comment placement and "Align Fn"

## [v0.4.7] - 2023-05-23

#### Added

- Add `--timers` and `--fast` options to `pretty-php` (CLI only)

#### Changed

- Restore PHP 7.4 support, courtesy of upstream `PhpToken` polyfill
- Normalise alias/import statements before sorting to fix inconsistent output between PHP 7.4 and PHP 8.0+ (grouped imports now appear after ungrouped ones)

## [v0.4.6] - 2023-05-18

#### Changed

- Update *PrettyPHP* to v0.4.6

## [v0.4.4] - 2023-05-16

#### Changed

- Peg the version of the extension to the bundled *PrettyPHP* version, e.g. this version comes with *PrettyPHP* v0.4.4
- Improve Windows support, including clearer feedback and instructions when PHP can't be found

#### Removed

- Remove the "Formatter Path" setting because versions other than the bundled version of *PrettyPHP* are likely to introduce compatibility issues

#### Fixed

- Fix PHP 8.0 issue where *PrettyPHP* reports `Your Composer dependencies require a PHP version ">= 8.1.0"` (sorry!)
- Fix regression where the "Format PHP without Preserving Newlines" command preserves newlines when a config file applicable to the file being formatted is found

## [v0.4.0] - 2023-04-27

#### Added

- Add "Preserve Trailing Spaces", "Honour Configuration Files" settings

#### Changed

- Update *PrettyPHP* to v0.4.1

## [v0.3.5] - 2023-04-04

#### Changed

- Update *PrettyPHP* to v0.3.22

## [v0.3.4] - 2023-03-28

#### Changed

- Update documentation

## [v0.3.3] - 2023-03-27

#### Added

- Add settings:

  - "Formatter Arguments"
  - "Sort Imports"
  - "Magic Commas"
  - "Indent Heredocs"
  - "Blank Before Return"
  - "Strict Lists"
  - "Align Chains"
  - "Align Fn"
  - "Align Lists"
  - "Align Ternary Operators"

#### Changed

- Suppress error notification when syntax is invalid
- Rename "Blank Before Declaration" setting to "Declaration Spacing"
- Update *PrettyPHP* to v0.3.19

## [v0.3.2] - 2023-03-14

#### Added

- Add "One Line Arguments" setting

#### Changed

- Update *PrettyPHP* to v0.3.17

## [v0.3.1] - 2023-03-07

#### Added

- Add "Blank Before Declaration", "Align Comments" settings

#### Changed

- Update *PrettyPHP* to v0.3.13

## [v0.3.0] - 2023-02-24

#### Added

- Add "Format PHP without Preserving Newlines" command
- Add "Simplify Strings", "Align Assignments", "Preserve One Line Statements" settings

#### Changed

- Require PHP 8+
- Update *PrettyPHP* to v0.3.6

## [v0.2.0] - 2023-02-06

#### Changed

- Update *PrettyPHP* to v0.2.0

## [v0.1.7] - 2023-01-27

#### Changed

- Update *PrettyPHP* to v0.1.10

## [v0.1.6] - 2023-01-25

#### Added

- Add "Formatter Path" setting

#### Changed

- Update *PrettyPHP* to v0.1.8
- Report errors via VS Code notifications

## [v0.1.5] - 2023-01-23

#### Added

- Add "PHP Path" setting

#### Changed

- Update *PrettyPHP* to v0.1.6
- Pass the active editor's indentation options to *PrettyPHP*
- Format code that uses PHP's short open tag (`<?`)

#### Fixed

- Fix PHP startup errors appearing in formatted code

## [v0.1.4] - 2023-01-20

Initial release

[v0.4.24]: https://github.com/lkrms/pretty-php/compare/v0.4.23...v0.4.24
[v0.4.23]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.22...v0.4.23
[v0.4.22]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.21...v0.4.22
[v0.4.21]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.20...v0.4.21
[v0.4.20]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.18...v0.4.20
[v0.4.19]: https://github.com/lkrms/pretty-php/compare/v0.4.18...v0.4.19
[v0.4.18]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.17...v0.4.18
[v0.4.17]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.16...v0.4.17
[v0.4.16]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.15...v0.4.16
[v0.4.15]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.14...v0.4.15
[v0.4.14]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.12...v0.4.14
[v0.4.13]: https://github.com/lkrms/pretty-php/compare/v0.4.12...v0.4.13
[v0.4.12]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.11...v0.4.12
[v0.4.11]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.8...v0.4.11
[v0.4.10]: https://github.com/lkrms/pretty-php/compare/v0.4.9...v0.4.10
[v0.4.9]: https://github.com/lkrms/pretty-php/compare/v0.4.8...v0.4.9
[v0.4.8]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.7...v0.4.8
[v0.4.7]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.6...v0.4.7
[v0.4.6]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.4...v0.4.6
[v0.4.4]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.0...v0.4.4
[v0.4.0]: https://github.com/lkrms/vscode-pretty-php/compare/v0.3.5...v0.4.0
[v0.3.5]: https://github.com/lkrms/vscode-pretty-php/compare/v0.3.4...v0.3.5
[v0.3.4]: https://github.com/lkrms/vscode-pretty-php/compare/v0.3.3...v0.3.4
[v0.3.3]: https://github.com/lkrms/vscode-pretty-php/compare/v0.3.2...v0.3.3
[v0.3.2]: https://github.com/lkrms/vscode-pretty-php/compare/v0.3.1...v0.3.2
[v0.3.1]: https://github.com/lkrms/vscode-pretty-php/compare/v0.3.0...v0.3.1
[v0.3.0]: https://github.com/lkrms/vscode-pretty-php/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/lkrms/vscode-pretty-php/compare/v0.1.7...v0.2.0
[v0.1.7]: https://github.com/lkrms/vscode-pretty-php/compare/v0.1.6...v0.1.7
[v0.1.6]: https://github.com/lkrms/vscode-pretty-php/compare/v0.1.5...v0.1.6
[v0.1.5]: https://github.com/lkrms/vscode-pretty-php/compare/v0.1.4...v0.1.5
[v0.1.4]: https://github.com/lkrms/vscode-pretty-php/releases/tag/v0.1.4
[lkrms/pretty-php v0.4.20]: https://github.com/lkrms/pretty-php/compare/v0.4.19...v0.4.20
[lkrms/pretty-php v0.4.16]: https://github.com/lkrms/pretty-php/compare/v0.4.15...v0.4.16
[lkrms/pretty-php v0.4.14]: https://github.com/lkrms/pretty-php/compare/v0.4.13...v0.4.14
