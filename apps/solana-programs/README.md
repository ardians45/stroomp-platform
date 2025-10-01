# Stroomp Solana Programs

This directory contains the Solana smart contracts for the Stroomp platform.

## Programs

### Stroomp Donation Program

The donation program enables users to send SOL donations to streamers with optional messages and anonymous donations.

## Setup

1. Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. Install Solana CLI: `sh -c "$(curl -sSfL https://release.solana.com/v1.17.5/install)"`
3. Install Anchor: `cargo install --git https://github.com/coral-xyz/anchor --tag v0.27.0 anchor-cli --locked`

## Build & Deploy

```bash
# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Run tests
anchor test
```

## Environment

Create a `.env` file with:

```bash
SOLANA_CLUSTER=devnet
ANCHOR_WALLET=~/.config/solana/id.json
```