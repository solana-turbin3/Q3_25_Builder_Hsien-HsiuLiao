Jito Bundles in TypeScript [Solana Tutorial] - Oct 6th '24 - https://www.youtube.com/watch?v=91k5QYdAprU

git clone https://github.com/jito-labs/jito-ts.git

yarn

env example https://youtu.be/91k5QYdAprU?si=SHanQm0Q6x0L9dLe&t=200

(no jito on devnet)

ts-node src/examples/simple_bundle/index.ts 

utils.ts

let maybeBundle = b.addTransactions(
      buildMemoTransaction(keypair, 'jito test 1', blockHash.blockhash),
      buildMemoTransaction(keypair, 'jito test 2', blockHash.blockhash)
    );