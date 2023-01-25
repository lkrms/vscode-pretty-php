# Changelog

All notable changes to the PrettyPHP extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.6] - 2023-01-25

### Added

- Add a formatter path setting for integration with custom versions of PrettyPHP.

### Changed

- Update PrettyPHP to v0.1.8. Fixes an issue where subsequent empty lines weren't truncated correctly in heredocs.
- Rename `pretty-php.php` setting to `pretty-php.phpPath`.
- Report errors via VSCode notifications.

## [0.1.5] - 2023-01-23

### Added

- Add PHP executable path setting.

### Changed

- Update PrettyPHP to v0.1.6.
- Pass the active editor's indentation options to PrettyPHP.
- Log output written to STDERR to the developer console even if no error occurs.
- Allow code being formatted to use PHP's short open tag (`<?`).

### Fixed

- Fix PHP startup errors appearing in formatted code.

## [0.1.4] - 2023-01-20

- Initial release

