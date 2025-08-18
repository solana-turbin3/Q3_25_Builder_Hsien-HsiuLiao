import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { useWallet } from '@/modules/wallet-providers/hooks/useWallet';
import { useState, useEffect, useCallback } from 'react';
import { IDL, ANCHOR_LOUDNESS_PROGRAM_ID, SOLANA_RPC_ENDPOINT, COMMITMENT } from '@/constants/idl';
import { AnchorLoudness } from '@/constants/idl';

// MWA Cluster ID Configuration:
// - 'solana:devnet' - for development and testing (what we're using)
// - 'solana:testnet' - for testing (alternative option)
// - 'solana:mainnet' - for production (avoid during development)
// 
// Note: The wallet should respect the specified cluster ID and not force mainnet.
// If the wallet still asks for mainnet, it might be a wallet-specific implementation issue.

// Check @solana/web3.js version compatibility
// Anchor requires v1, not v2
try {
  const web3Version = require('@solana/web3.js/package.json').version;
  console.log('@solana/web3.js version:', web3Version);
  if (web3Version.startsWith('2.')) {
    console.warn('⚠️ WARNING: @solana/web3.js v2 detected. Anchor requires v1 for compatibility.');
  }
} catch (error) {
  console.log('Could not determine @solana/web3.js version');
}

// Use BN directly from @coral-xyz/anchor for proper type compatibility
const createTimestamp = (timestamp: string): BN => {
  return new BN(Math.floor(Date.parse(timestamp) / 1000));
};

export class SolanaSubmissionService {
  private connection: Connection;
  private program: Program<AnchorLoudness>;
  private wallet: any;
  
  constructor(connection: Connection, program: Program<AnchorLoudness>, wallet: any) {
    this.connection = connection;
    this.program = program;
    this.wallet = wallet;
  }
  

  
  /**
   * Sign and send a transaction using MWA
   */
  private async signAndSendTransaction(transaction: Transaction, minContextSlot: number): Promise<string> {
    try {
      // Import MWA dynamically to avoid issues on iOS
      const mobileWalletAdapter = require('@solana-mobile/mobile-wallet-adapter-protocol-web3js');
      const { transact } = mobileWalletAdapter;
      
      console.log('Signing and sending transaction using MWA...');
      
      // Get fresh blockhash right before signing (simple approach like panorama-parking)
      console.log('Getting fresh blockhash for transaction...');
      const latestBlockhash = await this.connection.getLatestBlockhash();
      
      // Update transaction with the blockhash
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = this.wallet.publicKey;
      
      console.log('Blockhash selected:', latestBlockhash.blockhash);
      console.log('Last valid block height:', latestBlockhash.lastValidBlockHeight);
      
      // Use MWA's transact method to sign and send the transaction
      // Following the exact pattern from panorama-parking
      const signature = await transact(async (wallet: any) => {
        console.log('Wallet object in transact callback:', wallet);
        console.log('Wallet methods:', Object.getOwnPropertyNames(wallet));
        
        // First, request authorization from the wallet (like panorama-parking)
        console.log('Requesting MWA authorization...');
        const authResult = await wallet.authorize({
          cluster: 'devnet',
          identity: { name: 'Loudness App', uri: 'https://loudness.app' },
        });
        
        console.log('MWA authorization successful:', authResult);
        
        // Use the wallet's signAndSendTransactions method (exactly like panorama-parking)
        console.log('Signing and sending transaction with MWA...');
        const signatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
          minContextSlot: latestBlockhash.lastValidBlockHeight,
        });
        
        console.log('Transaction signed and sent successfully by MWA');
        return signatures[0];
      });
      
      console.log('Transaction signed and sent successfully!');
      console.log('Signature:', signature);
      
      // Simple confirmation like panorama-parking (exactly like their approach)
      try {
        console.log('Confirming transaction...');
        // Use the same blockhash from the transaction for confirmation (exactly like panorama-parking)
        await this.connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
        console.log('Transaction confirmed successfully!');
      } catch (error) {
        console.log('Transaction confirmation failed:', error);
        // Don't throw here - the transaction was sent successfully
        // This matches panorama-parking's approach exactly
        // They don't let confirmation failures stop the success flow
        console.log('💡 Tip: Transaction was sent successfully! You can check its status on Solana Explorer:');
        console.log(`🔗 https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
      
      return signature;
    } catch (error) {
      console.error('Failed to sign and send transaction with MWA:', error);
      throw error;
    }
  }

  /**
   * Initialize a user account on the Solana blockchain
   */
  async initializeUser(): Promise<{ signature: string; userAccountAddress: string }> {
    try {
      // Validate wallet public key
      if (!this.wallet.publicKey) {
        throw new Error('Wallet public key not available');
      }

      console.log('Initializing user account:', {
        walletPublicKey: this.wallet.publicKey.toString()
      });

      // Generate PDA address for the user account
      const userAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), this.wallet.publicKey.toBuffer()],
        this.program.programId
      )[0];

      // Create the initialize_user instruction transaction
      // Following the working pattern from panorama-parking project
      console.log('Initializing user account with wallet:', this.wallet.publicKey.toString());
      const transaction = await this.program.methods
        .initializeUser() // Call initialize_user instruction with no arguments
        .accountsPartial({
          user: this.wallet.publicKey,
          userAccount,
          systemProgram: SystemProgram.programId,
        })
        .transaction();
      
      // Note: Blockhash and feePayer are handled inside signAndSendTransaction
      // to ensure they're fresh and prevent expiration
      
      // Sign and send the transaction using MWA (blockhash handled internally)
      const signature = await this.signAndSendTransaction(transaction, 0); // minContextSlot handled internally
      
      console.log('User account initialization successful!');
      console.log('Signature:', signature);
      console.log('User Account Address:', userAccount.toString());
      
      return {
        signature,
        userAccountAddress: userAccount.toString()
      };
    } catch (error) {
      console.error('Failed to initialize user account:', error);
      throw error;
    }
  }

  /**
   * Submit a loudness entry to the Solana blockchain
   */
  async submitLoudnessEntry(data: {
    venueName: string;
    soundLevel: number;
    seatNumber: number;
    userRating: number;
    timestamp: string;
  }) {
    try {
      // Validate wallet public key
      if (!this.wallet.publicKey) {
        throw new Error('Wallet public key not available');
      }

      const venueName = data.venueName.trim();
      const soundLevel = data.soundLevel;
      const seatNumber = data.seatNumber;
      const userRating = data.userRating;
      const timestamp = data.timestamp || new Date().toISOString();

      console.log('Submitting loudness entry:', {
        venueName,
        soundLevel,
        seatNumber,
        userRating,
        timestamp,
        walletPublicKey: this.wallet.publicKey.toString()
      });

      // Create the sound level data structure that matches your Anchor program
      const soundLevelData = {
        soundLevel: soundLevel,
        timestamp: createTimestamp(timestamp),
        seatNumber: seatNumber,
        userRating: userRating,
      };

      // Generate PDA addresses for the accounts
      const config = PublicKey.findProgramAddressSync(
        [Buffer.from("loudness_config")],
        this.program.programId
      )[0];

      const venue = PublicKey.findProgramAddressSync(
        [config.toBuffer(), Buffer.from(venueName, 'utf8')],
        this.program.programId
      )[0];

      const userAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), this.wallet.publicKey.toBuffer()],
        this.program.programId
      )[0];

      const submission = PublicKey.findProgramAddressSync(
        [venue.toBuffer(), this.wallet.publicKey.toBuffer()],
        this.program.programId
      )[0];

      // Submit the transaction to the real Solana program
      // Following the working pattern from panorama-parking project
      const transaction = await this.program.methods
        .createSubmission(venueName, soundLevelData)
        .accountsPartial({
          user: this.wallet.publicKey,
          config,
          userAccount,
          venue,
          submission,
          systemProgram: SystemProgram.programId,
        })
        .transaction();
      
      // Note: Blockhash and feePayer are now handled inside signAndSendTransaction
      // to ensure they're fresh and prevent expiration
      
      // Sign and send the transaction using MWA (blockhash handled internally)
      const signature = await this.signAndSendTransaction(transaction, 0); // minContextSlot handled internally
      
      // Simple confirmation like panorama-parking (no complex retry logic)
      console.log('Transaction signed and sent successfully!');
      console.log('Signature:', signature);
      
      try {
        console.log('Confirming transaction...');
        // Use the same blockhash from the transaction for confirmation
        const latestBlockhash = await this.connection.getLatestBlockhash();
        await this.connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
        console.log('Transaction confirmed successfully!');
      } catch (error) {
        console.log('Transaction confirmation failed:', error);
        // Don't throw here - the transaction was sent successfully
        // User can check the signature on Solana Explorer
        // This matches panorama-parking's approach
        console.log('💡 Tip: Transaction was sent successfully! You can check its status on Solana Explorer:');
        console.log(`🔗 https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
      
      console.log('Transaction signature:', signature);
      
      return {
        signature: signature,
        submissionAddress: submission.toString(),
      };
    } catch (error) {
      console.error('Failed to submit loudness entry:', error);
      throw error;
    }
  }

  /**
   * Initialize the Solana connection and program
   */
  static async initialize(wallet: any) {
    try {
      // Validate wallet object
      if (!wallet) {
        throw new Error('Wallet is required');
      }

      // Get the public key safely
      const publicKey = wallet.publicKey || wallet.address;
      if (!publicKey) {
        throw new Error('Wallet public key not available');
      }

      console.log('Initializing Solana service with wallet:', {
        hasPublicKey: !!publicKey,
        publicKeyType: typeof publicKey,
        walletKeys: Object.keys(wallet),
        walletProvider: wallet.provider || 'unknown'
      });

      // Create connection to devnet
      const connection = new Connection(SOLANA_RPC_ENDPOINT, COMMITMENT);
      console.log('Solana connection created to:', SOLANA_RPC_ENDPOINT);

      // Create Anchor provider - use standard provider like panorama-parking
      const provider = new AnchorProvider(
        connection,
        {
          publicKey: new PublicKey(publicKey),
          signTransaction: async (tx) => await wallet.signTransaction(tx),
          signAllTransactions: async (txs) => await wallet.signAllTransactions(txs),
        },
        { commitment: COMMITMENT }
      );
      console.log('Using standard AnchorProvider like panorama-parking');
      console.log('Anchor provider created with commitment:', COMMITMENT);

      // Initialize the program with the actual IDL
      console.log('Initializing Program with IDL:', {
        idlAddress: IDL.address,
        idlInstructions: IDL.instructions?.length || 0,
        idlAccounts: IDL.accounts?.length || 0,
        idlTypes: IDL.types?.length || 0
      });
      
      const program = new Program(IDL as any, provider);
      console.log('Program initialized successfully with program ID:', program.programId.toString());

      return new SolanaSubmissionService(connection, program, wallet);
    } catch (error) {
      console.error('Failed to initialize Solana service:', error);
      console.error('Error details:', {
        errorName: (error as any).name,
        errorMessage: (error as any).message,
        errorStack: (error as any).stack
      });
      throw error;
    }
  }
}

/**
 * Hook to use the Solana submission service
 */
export function useSolanaSubmission() {
  const { wallet } = useWallet();
  const [service, setService] = useState<SolanaSubmissionService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Add initializeUser method to the hook
  const initializeUser = useCallback(async () => {
    if (!service || !isInitialized) {
      throw new Error('Solana service not ready');
    }
    return await service.initializeUser();
  }, [service, isInitialized]);

  // Debug wallet state
  useEffect(() => {
    console.log('useSolanaSubmission - Wallet state changed:', {
      hasWallet: !!wallet,
      walletType: wallet ? typeof wallet : 'none',
      walletKeys: wallet ? Object.keys(wallet) : [],
      // Safely access wallet properties
      hasPublicKey: wallet && 'publicKey' in wallet && !!wallet.publicKey,
      hasAddress: wallet && 'address' in wallet && !!wallet.address
    });
  }, [wallet]);

  useEffect(() => {
    // Only initialize with useWallet if we have a connected wallet with public key
    if (wallet && 'publicKey' in wallet && wallet.publicKey && !isInitialized) {
      console.log('Attempting to initialize Solana service with useWallet:', wallet);
      SolanaSubmissionService.initialize(wallet)
        .then((solanaService) => {
          console.log('Solana service initialized successfully with useWallet');
          setService(solanaService);
          setIsInitialized(true);
        })
        .catch((error) => {
          console.error('Failed to initialize Solana service with useWallet:', error);
          setIsInitialized(false);
        });
    }
  }, [wallet, isInitialized]);

    // Initialize with MWA wallet address when provided
  const initializeWithMWA = useCallback(async (walletAddress: string) => {
    if (!walletAddress || isInitialized) return;
    
    try {
      console.log('Initializing Solana service with MWA wallet address:', walletAddress);
      
      // Create a proper wallet object that implements the Solana wallet interface
      // PublicKey and Keypair are already imported at the top
      
      // Create a PublicKey object from the base58 address
      const publicKey = new PublicKey(walletAddress);
      
      // Create the wallet object with proper MWA signing interface
      // NO MOCKS - use actual MWA wallet for everything
      const mwaWallet = {
        publicKey: publicKey, // This is now a proper PublicKey object with toBuffer() method
        address: walletAddress,
        provider: 'mwa',
        // ✅ Use actual MWA wallet - no mock keypairs
        // The MWA wallet will handle all signing and fee payment
        signTransaction: async (tx: any) => {
          console.log('MWA signTransaction called - using MWA transact method');
          try {
            // Import MWA dynamically to avoid issues on iOS
            const mobileWalletAdapter = require('@solana-mobile/mobile-wallet-adapter-protocol-web3js');
            const { transact } = mobileWalletAdapter;
            
            // Log the transaction object to debug structure
            console.log('Transaction object type:', tx.constructor.name);
            console.log('Transaction object:', JSON.stringify(tx, null, 2));
            
            // Use MWA's transact method to sign the transaction
            const signedTx = await transact(async (wallet: any) => {
              // Log the wallet object to debug structure
              console.log('Wallet object in transact callback:', wallet);
              console.log('Wallet methods:', Object.getOwnPropertyNames(wallet));
              
              // Check if it's a versioned transaction and handle accordingly
              if (tx.constructor.name === "VersionedTransaction") {
                console.log('Handling VersionedTransaction');
                return await wallet.signTransaction(tx);
              } else {
                console.log('Handling regular Transaction');
                // Ensure we have a proper Transaction object
                const transaction = new Transaction();
                // Copy the transaction data properly
                Object.assign(transaction, tx);
                return await wallet.signTransaction(transaction);
              }
            });
            
            console.log('Transaction signed successfully by MWA');
            return signedTx;
          } catch (error) {
            console.error('Failed to sign transaction with MWA:', error);
            throw new Error(`MWA signing failed: ${error}`);
          }
        },
        signAllTransactions: async (txs: any[]) => {
          console.log('MWA signAllTransactions called - using MWA transact method');
          try {
            // Import MWA dynamically to avoid issues on iOS
            const mobileWalletAdapter = require('@solana-mobile/mobile-wallet-adapter-protocol-web3js');
            const { transact } = mobileWalletAdapter;
            
            // Log the transactions array length
            console.log('Transactions array length:', txs.length);
            txs.forEach((tx, index) => {
              console.log(`Transaction ${index} type:`, tx.constructor.name);
            });
            
            // Use MWA's transact method to sign all transactions
            const signedTxs = await transact(async (wallet: any) => {
              // Log the wallet object to debug structure
              console.log('Wallet object in transact callback (signAllTransactions):', wallet);
              console.log('Wallet methods:', Object.getOwnPropertyNames(wallet));
              
              // Note: We don't need to re-authorize here since the wallet is already connected
              // The MWA session should be valid from the initial connection
              console.log('Using existing MWA session for transaction signing...');
              
              // All transactions should be signed by the mobile wallet
              const signedTransactions = [];
              for (const tx of txs) {
                console.log(`Signing transaction ${signedTransactions.length + 1}`);
                
                // Check if it's a versioned transaction and handle accordingly
                if (tx.constructor.name === "VersionedTransaction") {
                  console.log('Handling VersionedTransaction in signAllTransactions');
                  const signedTx = await wallet.signTransaction(tx);
                  signedTransactions.push(signedTx);
                } else {
                  console.log('Handling regular Transaction in signAllTransactions');
                  // Ensure we have a proper Transaction object
                  const transaction = new Transaction();
                  // Copy the transaction data properly
                  Object.assign(transaction, tx);
                  const signedTx = await wallet.signTransaction(transaction);
                  signedTransactions.push(signedTx);
                }
              }
              return signedTransactions;
            });
            
            console.log('All transactions signed successfully by MWA');
            return signedTxs;
          } catch (error) {
            console.error('Failed to sign all transactions with MWA:', error);
            throw new Error(`MWA signing failed: ${error}`);
          }
        },
      };
      
      console.log('Created MWA wallet object with publicKey:', publicKey.toString());
      console.log('PublicKey has toBuffer method:', typeof publicKey.toBuffer === 'function');
      console.log('MWA wallet object keys:', Object.keys(mwaWallet));
      
      const solanaService = await SolanaSubmissionService.initialize(mwaWallet);
      setService(solanaService);
      setIsInitialized(true);
      console.log('Solana service initialized successfully with MWA wallet');
    } catch (error) {
      console.error('Failed to initialize Solana service with MWA wallet:', error);
      setIsInitialized(false);
    }
  }, [isInitialized]);

  const submitLoudnessEntry = async (data: {
    venueName: string;
    soundLevel: number;
    seatNumber: number;
    userRating: number;
    timestamp: string;
  }) => {
    if (!service) {
      throw new Error('Solana service not initialized');
    }
    return await service.submitLoudnessEntry(data);
  };

  return {
    service,
    isInitialized,
    submitLoudnessEntry,
    initializeUser,
    initializeWithMWA, // Export this function
  };
} 