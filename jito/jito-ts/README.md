# jito-ts

[![Discord](https://img.shields.io/discord/938287290806042626?label=Discord&logo=discord&style=flat&color=7289DA)](https://discord.gg/jTSmEzaR)
[![NPM Version](https://img.shields.io/npm/v/jito-ts)](https://www.npmjs.com/package/jito-ts)

Welcome to the Jito Typescript SDK repository! Use this to interact with the block-engine, relayer and future Jito APIs.

## Setup
Use with yarn `1.22`+ and Node 20.
```bash
yarn
```

### Building Protos
The generated proto files have been committed for convenience, but if there's ever a change you'll need to re-generate.
Steps to regenerate:
* Make sure you have protoc installed on your system
* If any new `.proto` files were added, update the appropriate `./scripts/gen-*-protos` script to include it.
* Run the appropriate `yarn gen-* ${PATH_TO_PROTOS}` and commit!

### Geyser

**Note:** Mac users may run into an error to the effect of "protoc-gen-js: program not found or is not executable";
if this is thrown, run:
* `brew install protobuf@3`
* `brew link --overwrite protobuf@3`
* `yarn gen-block-engine ${PATH_TO_BLOCK_ENGINE_PROTOS}`
* `yarn gen-geyser ${PATH_TO_GEYSER_PROTOS}`

## Usage

```bash
export RPC_URL="https://MY_RPC_URL"
export BLOCK_ENGINE_URL=mainnet.block-engine.jito.wtf
export AUTH_KEYPAIR_PATH=MY_AUTH_KEYPAIR.json
export BUNDLE_TRANSACTION_LIMIT=5

yarn run:simple_bundle
```

See other commands in `package.json`

Cursor AI



## Overview

The **Jito TypeScript SDK** (`jito-ts`) is a comprehensive toolkit for interacting with Jito's block engine, relayer, and other Jito APIs. Jito is a Solana infrastructure provider that enables **MEV (Maximal Extractable Value)** opportunities through bundle transactions and provides real-time blockchain data through Geyser.

## Key Components

### 1. **Block Engine SDK** (`/sdk/block-engine/`)
- **Purpose**: Enables MEV searchers to submit bundle transactions
- **Core Features**:
  - Bundle creation and submission
  - Tip account management
  - Leader slot scheduling
  - Bundle result monitoring

### 2. **Geyser SDK** (`/sdk/geyser/`)
- **Purpose**: Real-time blockchain data streaming
- **Core Features**:
  - Account updates monitoring
  - Program updates streaming
  - Processed block notifications
  - Heartbeat management

### 3. **RPC SDK** (`/sdk/rpc/`)
- **Purpose**: Enhanced RPC connection utilities
- **Core Features**:
  - Connection management
  - Error handling
  - Fetch implementations

## Setup Requirements

```bash
# Prerequisites
- Node.js 20+
- Yarn 1.22+
- protoc (for proto generation)

# Installation
yarn install
```

## Environment Configuration

Create a `.env` file with these variables:

```bash
# Required for Block Engine
RPC_URL="https://your-rpc-endpoint"
BLOCK_ENGINE_URL="mainnet.block-engine.jito.wtf"
AUTH_KEYPAIR_PATH="path/to/your/keypair.json"
BUNDLE_TRANSACTION_LIMIT=5

# Required for Geyser
GEYSER_URL="your-geyser-endpoint"
GEYSER_ACCESS_TOKEN="your-access-token"

# Optional monitoring
ACCOUNTS_OF_INTEREST="account1,account2"
PROGRAMS_OF_INTEREST="program1,program2"
```

## Usage Examples

### 1. **Simple Bundle Example** (`run:simple_bundle`)

This demonstrates how to create and submit bundle transactions:

```typescript
// Key components:
import { searcherClient } from '../../sdk/block-engine/searcher';
import { Bundle } from '../../sdk/block-engine/types';

// Main workflow:
1. Connect to block engine with authentication
2. Get tip accounts for MEV rewards
3. Wait for Jito leader slot (within 2 slots)
4. Create bundle with transactions
5. Add tip transaction for MEV rewards
6. Submit bundle to block engine
7. Monitor bundle results
```

**Run command:**
```bash
yarn run:simple_bundle
```

### 2. **Geyser Example** (`run:geyser`)

This demonstrates real-time blockchain monitoring:

```typescript
// Key components:
import { geyserClient } from '../../sdk';

// Main workflow:
1. Connect to Geyser with access token
2. Set up account monitoring
3. Set up program monitoring  
4. Set up block processing monitoring
5. Receive real-time updates via callbacks
```

**Run command:**
```bash
yarn run:geyser
```

## Core Concepts

### **Bundles**
- **Definition**: Atomic groups of 1-5 transactions that either all succeed or all fail
- **Purpose**: Enable MEV opportunities and ensure transaction ordering
- **Components**:
  - Regular transactions (your MEV strategy)
  - Tip transaction (rewards for validators)

### **MEV (Maximal Extractable Value)**
- **Definition**: Profits from transaction ordering and timing
- **Jito's Role**: Provides infrastructure for searchers to capture MEV
- **Rewards**: Tips are distributed to validators and stakers

### **Geyser**
- **Definition**: Real-time blockchain data streaming service
- **Use Cases**: 
  - Monitoring specific accounts/programs
  - Real-time trading strategies
  - DeFi protocol monitoring

## Available Scripts

```bash
# Development
yarn compile          # TypeScript compilation
yarn lint            # Code linting
yarn clean           # Clean build artifacts

# Proto Generation
yarn gen-block-engine # Generate block engine protos
yarn gen-geyser      # Generate geyser protos

# Examples
yarn run:simple_bundle # Run bundle example
yarn run:geyser       # Run geyser example
```

## Key Features

1. **Authentication**: Secure keypair-based authentication for block engine
2. **Bundle Management**: Create, sign, and submit atomic transaction bundles
3. **Real-time Streaming**: Monitor blockchain events via Geyser
4. **Error Handling**: Comprehensive error handling and result types
5. **Type Safety**: Full TypeScript support with generated types
6. **MEV Integration**: Built-in support for tip transactions and MEV rewards

## Use Cases

- **MEV Searchers**: Capture arbitrage, liquidation, and other MEV opportunities
- **DeFi Protocols**: Monitor real-time state changes
- **Trading Bots**: Execute atomic multi-transaction strategies
- **Analytics**: Real-time blockchain data analysis
- **Validators**: Integrate with Jito's block engine for MEV rewards

The SDK provides a production-ready interface for building sophisticated Solana applications that leverage Jito's MEV infrastructure and real-time data capabilities.