# krateoctl

`krateoctl` is the CLI for Krateo install, upgrade, migration, and version-aware composition operations.

## Installation

### Automatic installation (Linux/macOS)

#### Using curl

You can install the latest version of `krateoctl` easily by running the following command in your terminal:

```sh
curl -sL https://raw.githubusercontent.com/krateoplatformops/krateoctl/main/install.sh | bash
```

This script will:

- Detect your operating system and architecture
- Download the latest release binary
- Install it into _/usr/local/bin_ (requires sudo)
  - otherwise fallback to _$HOME/.local/bin_ 
- Make sure the install directory is in your _PATH_ environment variable

#### Using Homebrew (macOS)

```sh
brew tap krateoplatformops/krateoctl
brew install krateoctl
```

### Manual installation (Windows or other OS)

For Windows or if you prefer manual installation:

- Go to the [Releases page](https://github.com/krateoplatformops/krateoctl/releases)
- Download the appropriate archive for your OS and architecture
- Extract the binary
- Add the extracted binary to your system's PATH

## Getting Help

Every `krateoctl` command includes detailed help documentation accessible via the `-h` flag:

```sh
# Show top-level help and available commands
krateoctl -h

# Show help for a specific subcommand
krateoctl install -h

# Show help for a specific command action
krateoctl install plan -h
krateoctl install apply -h
```

The help output includes flags, examples, and usage information for each command. This is the most up-to-date reference for command options.

## Command Reference

- [Install and Upgrade](20-install-upgrade.md)
- [Installation Migration](30-installation-migration.md)
- [Get Compositions](40-get-compositions.md)
- [Secrets Spec](50-secrets.md)
