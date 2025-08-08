https://docs.switchboard.xyz/product-documentation/data-feeds/solana-svm/part-1-designing-and-simulating-your-feed/option-2-designing-a-feed-in-typescript

install bun 

curl -fsSL https://bun.sh/install | bash

$ bun init

✓ Select a project template: Blank

 + .gitignore
 + .cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc
 + index.ts
 + tsconfig.json (for editor autocomplete)

To get started, run:

    bun run index.ts

bun install v1.2.19 (aad3abea)

+ @types/bun@1.2.19
+ typescript@5.9.2

7 packages installed [3.64s]

$ bun add @switchboard-xyz/on-demand
bun add v1.2.19 (aad3abea)

installed @switchboard-xyz/on-demand@2.13.3

112 packages installed [7.55s]

Blocked 1 postinstall. Run `bun pm untrusted` for details.

```bun run index.ts```