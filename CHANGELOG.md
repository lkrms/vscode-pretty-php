# Changelog

Notable changes to this extension and to [pretty-php][] itself are documented in this file.

It is generated from the GitHub release notes of both projects by [salient/changelog][]. The format is based on [Keep a Changelog][].

[pretty-php]: https://github.com/lkrms/pretty-php
[salient/changelog]: https://github.com/salient-labs/php-changelog
[Keep a Changelog]: https://keepachangelog.com/en/1.1.0/

## [v0.4.56] - 2024-03-11

### Added

- Move comments if necessary for correct placement of adjacent delimiters and operators
- Normalise casts to their canonical form (e.g. `( DOUBLE ) $var` -> `(float) $var`)

### Changed

- Refactor for clarity, speed and to reduce memory consumption
- Improve underlying API, incl. removal of unused methods and creation of a standalone `Parser` class
- Update dependencies

### Fixed

- Fix issue where an untrusted `PhpToken` polyfill may be extended from the `Token` class on PHP 7.4
- Fix issue where `--operators-first` and `--operators-last` have no effect
- Fix issue where hanging indentation is not always applied when `--operators-first` is given

## [v0.4.55] - 2024-02-27

### Changed

- Update dependencies

## [v0.4.54] - 2024-02-08

### Changed

- Don't insert space between `exit`/`die` and subsequent parentheses (#99)
- Move assignment and comparison operators to the start of the line when `--operators-first` is given
- Allow `--output` to be given when reading from standard input

### Fixed

- Fix issue where enum comments are indented like switch comments (#97)

## [v0.4.53] - 2024-02-02

### Changed

- Suppress blank lines between `use`, `use function` and `use constant` groups when `sort-imports` is disabled

### Fixed

- Fix issue where `--no-sort-imports` fails with "--sort-imports-by and --no-sort-imports/--disable=sort-imports cannot both be given"

## [v0.4.52] - 2024-01-29

### Changed

- Allow `--print-config` to be combined with `--config` without losing input files given on the command line

### Fixed

- Fix "file not found" exception when processing configuration files in directories other than the current working directory

## [v0.4.51] - 2024-01-28

### Fixed

- Update dependencies to work around "Private methods cannot be final as they are never overridden by other classes" bug in PHP 8.3.2

## [v0.4.50] - 2024-01-21

> pretty-php for Visual Studio Code v0.4.50 was not released

### Fixed

- Copy build tools to the repository to fix downstream packaging issues

## [v0.4.49] - 2024-01-21

### Added

- Add another `--quiet` level so a summary of changes can be printed without reporting every file replaced
- Add colour to unified `--diff` output when the standard output is a TTY

### Changed

- Escape non-ASCII characters with Unicode's "blank" property
- Improve validation of options loaded from configuration files
- Improve `--debug` output
- Add `--log-progress` so `--debug` need not be combined with `--verbose` to generate progress-log files

### Fixed

- Fix bugs related to empty directories and configuration files, e.g. where `pretty-php` falls backs to reading from `STDIN` when directories given on the command line yield no files to format

## [v0.4.48] - 2024-01-11

### Added

- Add "pretty-php.formatting.simplifyNumbers" setting
- Normalise integers and floats

  Before:

  ```php
  <?php
  $decimal = [0, 1234567, 1_2_3, 12_34_56_7];
  $hex = [0x1, 0x000b, 0xfe0, 0X00_CA_FE_F0_0D];
  $octal = [00, 000_600, 0o755, 0O411];
  $binary = [0b1, 0b0011, 0B101];
  $float = [.14, 3., 03.00, 00.1400, 06.71E+083, 671.21e-4];
  ```

  After:

  ```php
  <?php
  $decimal = [0, 1234567, 123, 1_234_567];
  $hex = [0x01, 0x0B, 0x0FE0, 0xCAFE_F00D];
  $octal = [0, 0600, 0755, 0411];
  $binary = [0b01, 0b11, 0b0101];
  $float = [0.14, 3.0, 3.0, 0.14, 6.71e83, 6.7121e-2];
  ```
- Add `--no-simplify-numbers` option
- Sign `pretty-php.phar` releases for improved PHIVE support

### Fixed

- Fix regression in [v0.4.47] where some Unicode sequences are escaped incorrectly, producing output like `"🧑\u{200D}🚒"` instead of `'🧑‍🚒'`
- Fix issue where strings containing sequences like `"\0002"` (`NUL` followed by `"2"`) are incorrectly normalised to `"\02"` (equivalent to `"\x02"`)
- Fix output validation issue where all tokens are truncated for comparison, not just comments

## [v0.4.47] - 2024-01-08

### Changed

- Use `\x{####}` to escape UTF-8 characters with the Unicode `Default_Ignorable_Code_Point` property to improve code readability when working with invisible sequences, e.g. Unicode byte order marks

### Fixed

- Fix issue where escaped carriage returns (`"\r"`) are not preserved in multiline strings
- Fix issue where strings with invalid UTF-8 sequences trigger an exception

## [v0.4.46] - 2023-12-29

### Changed

- Remove `align-lists` from the `laravel` preset
- Don't force newlines between boolean operators and negated expressions

  Before:

  ```php
  <?php
  foo(bar() &&
      qux() &&
      quux() &&
      !(
          quuux() ||
          quuuux()
      ));
  ```

  After:

  ```php
  <?php
  foo(bar() &&
      qux() &&
      quux() && !(
          quuux() ||
          quuuux()
      ));
  ```

### Fixed

- Fix `sort-imports` issue where traits inserted into enums are sorted in error

## [v0.4.45] - 2023-12-22

### Added

- Add "Create .prettyphp or prettyphp.json" command
- Add "pretty-php.formatting.moveComments" setting

### Fixed

- Fix regression where disabled rules are ignored in strict PSR-12 mode

## [v0.4.44] - 2023-12-21

> pretty-php for Visual Studio Code v0.4.44 was not released

### Changed

- Propagate line breaks after logical and bitwise operators to others of equal or lower precedence in the same statement

  ```php
  <?php
  // Input
  foo(bar() ||
      baz() || qux() && quux() || quuux());

  // Output
  foo(bar() ||
      baz() ||
      qux() && quux() ||
      quuux());
  ```
- Place comments with subsequent delimiters after the delimiters, demoting DocBlocks to standard C-style comments as a precaution

  Input:

  ```php
  <?php
  [
      // comment
      0 => 'foo'
      ,1 => 'bar'
      // comment
      ,2 => 'baz'
  ];

  [
      /** DocBlock */
      0 => 'foo'
      ,1 => 'bar'
      /** invalid DocBlock */
      ,2 => 'baz'
  ];
  ```

  Previous output:

  ```php
  <?php
  [
      // comment
      0 => 'foo',
      1 => 'bar'
          // comment
          , 2 => 'baz'
  ];

  [
      /** DocBlock */
      0 => 'foo',
      1 => 'bar'
          /** invalid DocBlock */, 2 => 'baz'
  ];
  ```

  Current output:

  ```php
  <?php
  [
      // comment
      0 => 'foo',
      1 => 'bar',
      // comment
      2 => 'baz'
  ];

  [
      /** DocBlock */
      0 => 'foo',
      1 => 'bar',
      /* invalid DocBlock */
      2 => 'baz'
  ];
  ```
- Preserve newlines before `??=`, not after
- Do not keep `<?php...?>` blocks on one line if they contain more than one statement
- Improve indentation and alignment heuristics when HTML has embedded PHP
- Stop looking for a configuration file when a `.svn` directory is found (`.git` and `.hg` directories already had this effect)
- Rework exit codes for more granular feedback
- Update usage information and JSON schema

### Fixed

- Fix issue where output is written to standard output when an explicit `--output` file is given
- Don't print "Formatting 1 of 1: php://stdin" when reading TTY input

## [v0.4.43] - 2023-11-09

### Changed

- Always move doc comments (`/**` ... `*/`) to the next line
- Don't add blank lines before multi-line doc comments or their C-style counterparts if they appear mid-statement
- Collapse doc comments with one line of content to a single line (unless they appear to describe a file or are pinned to a declaration)
- **Remove empty doc comments**

## [v0.4.42] - 2023-10-26

### Added

- Add (experimental) support for PHP 8.3

### Fixed

- Fix issue where `CompileError` exceptions thrown by the PHP 8.3 tokenizer are not caught
- Fix ternary alignment issue when `??` appears in the first expression

  Before:

  ```php
  <?php
  $foo = $bar
      ? $qux[$i] ?? $fallback
          : $quux;
  ```

  After:

  ```php
  <?php
  $foo = $bar
      ? $qux[$i] ?? $fallback
      : $quux;
  ```
- Fix issue where labels after close braces are not correctly identified

  Before:

  ```php
  <?php
  if ($foo) {
      goto bar;
  }
  bar: qux();
  ```

  After:

  ```php
  <?php
  if ($foo) {
      goto bar;
  }
  bar:
  qux();
  ```

## [v0.4.41] - 2023-10-20

### Changed

- Link to `pretty-php` usage information from the "Formatter Arguments" description
- Review files excluded by default when running from the command line
  - The default regex is now case sensitive: `/\/(\.git|\.hg|\.svn|_?build|dist|vendor)\/$/`
  - Files in `**/tests*/` and `**/var/` are no longer excluded by default

### Removed

- Remove "Honour Configuration Files" setting (configuration files are always honoured)

### Added

- Add experimental `drupal` preset (available via `--preset drupal`)

### Fixed

- Fix issue where indentation is incorrect when arguments to `new static(...` break over multiple lines
- Fix same issue with `isset()` lists

  Before:

  ```php
  <?php
  isset($a,
  $b);
  ```

  After:

  ```php
  <?php
  isset($a,
      $b);
  ```

## [v0.4.40] - 2023-10-19

### Fixed

- Fix issue where XML files are incorrectly identified as PHP files
- Fix issue where ternary operators are not always identified correctly

  Before:

  ```php
  <?php
  $filter =
      $exclude
          ? function ($value, $key, $iterator) use ($exclude)
          : bool {
              return (bool) preg_match($exclude, $key);
          }
      : null;
  ```

  After:

  ```php
  <?php
  $filter =
      $exclude
          ? function ($value, $key, $iterator) use ($exclude): bool {
              return (bool) preg_match($exclude, $key);
          }
          : null;

  ```

## [v0.4.39] - 2023-10-17

### Changed

- Suppress a level of hanging indentation in lists with one item

### Fixed

- Fix regression where hanging indentation isn't always applied after assignment operators
- Fix bug where tokens adjacent to brackets that enclose one token on its own line are indented incorrectly

## [v0.4.38] - 2023-10-16

### Changed

- Add code samples to the descriptions of more settings
- Treat null coalescing operators (`??`) the same as ternary operators (`?:`) for hanging indentation and alignment purposes
- Improve robustness of declaration type matching

### Fixed

- Fix regression in hanging indentation where some expressions are indented unnecessarily
- Fix issue where output may not be idempotent in strict PSR-12 mode when comments appear after closing braces in the input

## [v0.4.37] - 2023-10-13

### Changed

- Improve hanging indentation heuristics

  Before:

  ```php
  <?php
  $a =
      $b
          . $c
          . $d;
  ```

  After:

  ```php
  <?php
  $a =
      $b
      . $c
      . $d;
  ```

### Fixed

- Fix issue where newlines between arrow functions and bodies are not always preserved

## [v0.4.36] - 2023-10-10

### Fixed

- Fix "Call to a member function declarationParts() on bool" exception reported in #60

## [v0.4.35] - 2023-10-09

### Changed

- Always preserve blank lines between statements (even when `--ignore-newlines` is given)
- Suppress line breaks between `,` and `=>` in match expressions, e.g.

  ```php
  <?php
  match ($a) {
      0,
      => false,
  };
  ```
- Suppress blank lines before and after comments in intra-statement contexts, e.g.

  ```php
  <?php
  class Foo
  //

  {
    public function bar() {}
  }
  ```

### Fixed

- Fix issue where, in strict PSR-12 mode, the `=>` operator after an arrow function that returns by reference is not moved to the next line

## [v0.4.34] - 2023-10-07

> pretty-php for Visual Studio Code v0.4.34 was not released

### Fixed

- Fix issue where `vendor/bin/pretty-php` fails

## [v0.4.33] - 2023-10-04

### Changed

- Always move docblocks to the start of their own line to reflect their association with subsequent structural elements
- Treat C-style comments that break over multiple lines as docblocks for vertical spacing purposes
  - Multi-line C-style comments aren't "pinned" to subsequent code like docblocks are, but they are handled consistently otherwise
- Improve inline comment handling when collapsing hanging indentation

### Fixed

- Fix issue where arrays created with square brackets are not treated as lists in some contexts
- Fix inconsistent formatting of anonymous functions that return values by reference

## [v0.4.32] - 2023-10-03

### Changed

- In strict PSR-12 mode, add whitespace between exception delimiters in `catch` blocks
- Always add a newline before the first object operator in a multi-line method chain (unless `align-chains` is enabled and strict PSR-12 mode is disabled)
- Format `for` loop expressions as list items when `align-lists` is enabled
- If an expression in a `for` loop breaks over multiple lines, add a newline after each comma-delimited expression, and a blank line between each semicolon-delimited expression
- Suppress whitespace in empty `for` loop expressions

### Fixed

- Fix DNF type formatting

  Before:

  ```php
  <?php
  class Foo
  {
      public(Countable & ArrayAccess)|MyClass|string|null $Bar;
  }
  ```

  After:

  ```php
  <?php
  class Foo
  {
      public (Countable&ArrayAccess)|MyClass|string|null $Bar;
  }
  ```
- Fix issue where parameter lists are not recognised as lists when they belong to an anonymous function that returns by reference
- Fix `align-lists` issue where adjacent declaration and control structure bodies are aligned with the preceding list item

## [v0.4.31] - 2023-09-29

### Added

- Add JSON schema for .prettyphp files

## [v0.4.30] - 2023-09-28

### Changed

- Update dependencies and packaging

### Fixed

- An upstream issue where "-" could not be given as the only argument has been fixed

## [v0.4.29] - 2023-09-25

### Changed

- Convert shell-style comments (`#`) to C++-style comments (`//`)
- Add a space between `//` and subsequent text
- Remove leading and trailing empty lines from PHP docblocks
- Preserve indentation when normalising PHP docblocks
- Improve heuristics so C-style comments (`/* ... */`) are normalised like PHP docblocks more consistently
- Don't reindent multiline comments beside code if they have text in column 1, e.g.

  ```php
  <?php
  foo(); /* this comment
  starts after column 1
  but has text in column 1 */
  ```

## [v0.4.28] - 2023-09-18

### Changed

- **Revert change to logical operator placement in v0.4.27**

  This change was intended to improve the readability of PSR-12-compliant control structure expressions, but output was inconsistent and there were unforeseen side-effects, so v0.4.26 behaviour has been restored. Apologies for the disruption!
- In strict PSR-12 mode, move comments beside the closing brace of classes, interfaces, etc. to the next line
- Move multi-line docblocks beside code to their own line
- When adding blank lines before statements, respect continuation of earlier comments
- Remove blank lines between subsequent one-line `declare` statements
- For vertical spacing purposes, treat consecutive property declarations as the same declaration type, regardless of syntax (e.g. when `var` is mixed with `private`)

### Fixed

- Fix issue where blank lines are added after `<?php` when there are two or more subsequent declarations of the same type
- If subsequent declaration types are different, propagate spacing from earlier siblings of the same type to avoid output like the following (there should be a blank line between `class B` and `class C`):

  ```php
  <?php
  class A
  {
      public function a() {}
  }

  class B {}
  class C {}
  ```
- Add blank lines before comments that trigger vertical expansion of declarations, preventing output like:

  ```php
  <?php
  class A
  {
      public $foo;
      public $bar;
      // There should be a blank line above this
      public $baz;

      public $qux;
  }
  ```

## [v0.4.27] - 2023-09-16

### Changed

- Report output from `pretty-php` to stderr in the output channel
- Move logical operators to the start of the line in contexts where hanging indentation will not be applied

### Added

- Add `StrictExpressions` rule for PSR-12-compliant handling of multi-line control structure expressions

### Fixed

- Improve `PreserveLineBreaks` heuristics to fix an issue where leading operators remain at the end of a line when followed by `!` on the next line

## [v0.4.26] - 2023-09-14

### Fixed

- Fix issue where backslashes in heredocs are escaped unnecessarily
- Fix additional escaping issues, e.g. in strings like `"\\\{$a}"`

## [v0.4.25] - 2023-09-11

### Changed

- Update setting descriptions
- Normalise constant parts of all strings--including heredocs and between backtick operators--not just single- and double-quoted constant strings
- Remove unnecessary backslash escapes
- Escape `"\x1b"` as `"\e"`

### Fixed

- Fix regression in v0.4.24 where unnecessary backslashes are added in some contexts (sorry!)

## [v0.4.24] - 2023-09-09

### Changed

- Unescape leading tabs in strings when using tabs for indentation
- Remove `T_BAD_CHARACTER` tokens

## [v0.4.23] - 2023-09-06

### Changed

- Improve performance by removing unnecessary type checking

## [v0.4.22] - 2023-08-31

### Changed

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

### Changed

- Change default sort order of alias/import statements to depth-first
  - To restore the previous behaviour, use `--sort-imports-by name` or set "Sort Imports By" to "name"
- When sorting by name, don't place grouped alias/import statements below ungrouped imports
- Collapse space after `;` in `for` loops if the next expression is empty
- Preserve newlines before and after attributes
- Add a newline before every parameter, not just annotated parameters, when splitting parameter lists to accommodate attributes

### Fixed

- Fix issue where blocks that start with an empty statement (e.g. `function () { ; // ...`) are not indented correctly
- Fix issue where anonymous class declarations are not always recognised
- Fix issue where newlines are added after inline comments between control structure tokens, leading to unnecessary indentation
- Fix issue where arrow function alignment fails in strict PSR-12 mode
- Fix `align-lists` issue where list items appearing consecutively on the same line are not always aligned correctly

## [v0.4.20] - 2023-08-24

### Changed

- Remove "Magic Commas" setting
- Rename "Align Assignments" setting to "Align Data"

### Fixed

- Downgrade Box to fix an issue where `pretty-php.phar` fails with an exception on Windows

## [v0.4.19] - 2023-08-11

> pretty-php for Visual Studio Code v0.4.19 was not released

### Added

- Add `symfony` preset (CLI only)

### Changed

- Make `magic-commas` rule mandatory and remove it from command line options
- Rename `align-assignments` rule to `align-data`
- Adopt Box for cleaner, leaner PHAR builds
- Remove upper limit on PHP version to allow running on PHP 8.3
- Suppress `E_COMPILE_WARNING` errors (they can't be caught or actioned, don't affect output and aren't user-friendly)

### Fixed

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

### Added

- Add support for inline parameter attributes

### Changed

- Suppress hanging indents in `match` expressions
- Preserve blank lines between the arms of `match` expressions

### Fixed

- Fix header spacing issue caused by inconsistent handling of `?>` tags that double as statement terminators
- Fix edge case where multi-line anonymous class interface lists are not indented
- Fix PHP 7.4 issue where `T_ATTRIBUTE_COMMENT` may not be the last token on the line

## [v0.4.17] - 2023-08-04

### Fixed

- Fix hanging indentation regression

## [v0.4.16] - 2023-08-04

### Added

- Add "Psr12" setting
- Write messages to an output channel instead of `console`
- Preserve newline after `throw`
- Add optional depth-first import sort order (available via `--sort-imports-by`)
- Make heredoc indentation configurable via `--heredoc-indent`
- Add `--operators-first` and `--operators-last` flags (CLI only)
- Apply strict PSR-12 `<?php declare...` formatting and heredoc indentation when `--psr12` is given (CLI only)

### Changed

- Replace "Sort Imports" setting with "Sort Imports By"
- Replace "Indent Heredocs" setting with "Heredoc Indentation"
- Migrate previous values of replaced settings
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

### Removed

- Remove `one-line-arguments` from available rules
- Remove `--disable indent-heredocs` (replaced with `--heredoc-indent none`)

### Fixed

- Detect more unary contexts
- Refactor block detection to fix alignment anomalies when PHP and markup are mixed

## [v0.4.15] - 2023-07-13

### Changed

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

### Removed

- Remove "preserve trailing spaces" option
- Don't report unnecessary parentheses

### Fixed

- Track and report output position to fix inaccurate problem report locations

## [v0.4.14] - 2023-07-05

### Removed

- Remove "Preserve Trailing Spaces", "One Line Arguments" settings

### Added

- Add initial support for the WordPress code style via `--preset wordpress` (CLI only)

### Changed

- Improve support for attributes when running on PHP 7.4

### Fixed

- Fix issue where `if` in `else if` is treated as a new statement

## [v0.4.13] - 2023-06-29

> pretty-php for Visual Studio Code v0.4.13 was not released

### Removed

- Remove Laravel-specific formatting rules (`--preset laravel` output is unchanged):
  - `space-after-fn`
  - `space-after-not`
  - `no-concat-spaces`

### Fixed

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

### Added

- When a list of interfaces after `extends` or `implements` spans multiple lines, move every interface to its own line

### Changed

- Shorten empty class and function bodies to `{}` and move them to the previous line
- Improve formatting of anonymous classes and attributes
- Add a blank line between file-level docblocks and `declare` statements

### Fixed

- Many small bugs you probably hadn't noticed

## [v0.4.11] - 2023-06-16

### Changed

- Improve handling of control structures where braced and unbraced bodies are combined and/or nested

### Fixed

- Fix possible exception when "Align Lists" and "Align Fn" are combined

## [v0.4.10] - 2023-06-15

> pretty-php for Visual Studio Code v0.4.10 was not released

### Changed

- Update dependencies

## [v0.4.9] - 2023-06-06

> pretty-php for Visual Studio Code v0.4.9 was not released

### Fixed

- Fix issue where config files above the working directory are not found
- Fix issue where invalid or empty config files trigger an unrelated exception

## [v0.4.8] - 2023-05-25

### Changed

- Improve formatting of chained method calls
- Ignore all but the last of any incompatible rules given on the command line
- Update `laravel` preset (CLI only)

### Fixed

- Fix issue where operators after `$object->{$property}` expressions are sometimes treated as unary operators
- Fix issue where "Align Lists" adds newlines between method chain arguments
- Fix handling of one-line comments with a subsequent close bracket
- Add tests for idempotent output and fix issues subsequently detected in comment placement and "Align Fn"

## [v0.4.7] - 2023-05-23

### Added

- Add `--timers` and `--fast` options to `pretty-php` (CLI only)

### Changed

- Restore PHP 7.4 support, courtesy of upstream `PhpToken` polyfill
- Normalise alias/import statements before sorting to fix inconsistent output between PHP 7.4 and PHP 8.0+ (grouped imports now appear after ungrouped ones)

## [v0.4.6] - 2023-05-18

### Changed

- Update *PrettyPHP* to v0.4.6

## [v0.4.4] - 2023-05-16

### Changed

- Peg the version of the extension to the bundled *PrettyPHP* version, e.g. this version comes with *PrettyPHP* v0.4.4
- Improve Windows support, including clearer feedback and instructions when PHP can't be found

### Removed

- Remove the "Formatter Path" setting because versions other than the bundled version of *PrettyPHP* are likely to introduce compatibility issues

### Fixed

- Fix PHP 8.0 issue where *PrettyPHP* reports `Your Composer dependencies require a PHP version ">= 8.1.0"` (sorry!)
- Fix regression where the "Format PHP without Preserving Newlines" command preserves newlines when a config file applicable to the file being formatted is found

## [v0.4.0] - 2023-04-27

### Added

- Add "Preserve Trailing Spaces", "Honour Configuration Files" settings

### Changed

- Update *PrettyPHP* to v0.4.1

## [v0.3.5] - 2023-04-04

### Changed

- Update *PrettyPHP* to v0.3.22

## [v0.3.4] - 2023-03-28

### Changed

- Update documentation

## [v0.3.3] - 2023-03-27

### Added

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

### Changed

- Suppress error notification when syntax is invalid
- Rename "Blank Before Declaration" setting to "Declaration Spacing"
- Update *PrettyPHP* to v0.3.19

## [v0.3.2] - 2023-03-14

### Added

- Add "One Line Arguments" setting

### Changed

- Update *PrettyPHP* to v0.3.17

## [v0.3.1] - 2023-03-07

### Added

- Add "Blank Before Declaration", "Align Comments" settings

### Changed

- Update *PrettyPHP* to v0.3.13

## [v0.3.0] - 2023-02-24

### Added

- Add "Format PHP without Preserving Newlines" command
- Add "Simplify Strings", "Align Assignments", "Preserve One Line Statements" settings

### Changed

- Require PHP 8+
- Update *PrettyPHP* to v0.3.6

## [v0.2.0] - 2023-02-06

### Changed

- Update *PrettyPHP* to v0.2.0

## [v0.1.7] - 2023-01-27

### Changed

- Update *PrettyPHP* to v0.1.10

## [v0.1.6] - 2023-01-25

### Added

- Add "Formatter Path" setting

### Changed

- Update *PrettyPHP* to v0.1.8
- Report errors via VS Code notifications

## [v0.1.5] - 2023-01-23

### Added

- Add "PHP Path" setting

### Changed

- Update *PrettyPHP* to v0.1.6
- Pass the active editor's indentation options to *PrettyPHP*
- Format code that uses PHP's short open tag (`<?`)

### Fixed

- Fix PHP startup errors appearing in formatted code

## [v0.1.4] - 2023-01-20

Initial release

[v0.4.56]: https://github.com/lkrms/pretty-php/compare/v0.4.55...v0.4.56
[v0.4.55]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.54...v0.4.55
[v0.4.54]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.53...v0.4.54
[v0.4.53]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.52...v0.4.53
[v0.4.52]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.51...v0.4.52
[v0.4.51]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.49...v0.4.51
[v0.4.50]: https://github.com/lkrms/pretty-php/compare/v0.4.49...v0.4.50
[v0.4.49]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.48...v0.4.49
[v0.4.48]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.47...v0.4.48
[v0.4.47]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.46...v0.4.47
[v0.4.46]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.45...v0.4.46
[v0.4.45]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.43...v0.4.45
[v0.4.44]: https://github.com/lkrms/pretty-php/compare/v0.4.43...v0.4.44
[v0.4.43]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.42...v0.4.43
[v0.4.42]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.41...v0.4.42
[v0.4.41]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.40...v0.4.41
[v0.4.40]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.39...v0.4.40
[v0.4.39]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.38...v0.4.39
[v0.4.38]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.37...v0.4.38
[v0.4.37]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.36...v0.4.37
[v0.4.36]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.35...v0.4.36
[v0.4.35]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.33...v0.4.35
[v0.4.34]: https://github.com/lkrms/pretty-php/compare/v0.4.33...v0.4.34
[v0.4.33]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.32...v0.4.33
[v0.4.32]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.31...v0.4.32
[v0.4.31]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.30...v0.4.31
[v0.4.30]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.29...v0.4.30
[v0.4.29]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.28...v0.4.29
[v0.4.28]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.27...v0.4.28
[v0.4.27]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.26...v0.4.27
[v0.4.26]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.25...v0.4.26
[v0.4.25]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.24...v0.4.25
[v0.4.24]: https://github.com/lkrms/vscode-pretty-php/compare/v0.4.23...v0.4.24
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
