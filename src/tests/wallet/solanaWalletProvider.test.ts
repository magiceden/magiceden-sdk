import { SolanaKeypairWalletProvider } from '../../wallet/solana/solanaKeypairWalletProvider';
import {
  Keypair,
  Connection,
  VersionedTransaction,
} from '@solana/web3.js';

// Mock the Connection class and other Solana objects
jest.mock('@solana/web3.js', () => {
  const original = jest.requireActual('@solana/web3.js');
  
  // Create a mock Keypair class
  class MockKeypair {
    publicKey = { 
      toBase58: () => 'mock-public-key',
      toBytes: () => new Uint8Array(32),
      toString: () => 'mock-public-key',
    };
    secretKey = new Uint8Array(64).fill(1);
  }
  
  // Create a mock VersionedTransaction class
  class MockVersionedTransaction {
    constructor() {
      // Empty constructor
    }
    sign = jest.fn();
  }
  
  return {
    ...original,
    Keypair: {
      ...original.Keypair,
      generate: () => new MockKeypair(),
      fromSecretKey: () => new MockKeypair(),
    },
    Connection: jest.fn().mockImplementation(() => ({
      getBalance: jest.fn().mockResolvedValue(1000000000), // 1 SOL
      getLatestBlockhash: jest.fn().mockResolvedValue({
        blockhash: 'mock-blockhash',
        lastValidBlockHeight: 123456,
      }),
      sendTransaction: jest.fn().mockResolvedValue('mock-signature'),
      confirmTransaction: jest.fn().mockResolvedValue({
        context: { slot: 1 },
        value: { err: null },
      }),
      getSignatureStatus: jest.fn().mockResolvedValue({
        context: { slot: 1 },
        value: { slot: 1, confirmations: 1, err: null, confirmationStatus: 'confirmed' },
      }),
      requestAirdrop: jest.fn().mockResolvedValue('mock-airdrop-signature'),
      rpcEndpoint: 'https://api.devnet.solana.com',
    })),
    VersionedTransaction: MockVersionedTransaction,
    MessageV0: {
      compile: jest.fn().mockReturnValue({}),
    },
    SystemProgram: {
      transfer: jest.fn().mockReturnValue({}),
    },
    ComputeBudgetProgram: {
      setComputeUnitPrice: jest.fn().mockReturnValue({}),
      setComputeUnitLimit: jest.fn().mockReturnValue({}),
    },
    PublicKey: jest.fn().mockImplementation((key) => ({
      toBase58: () => typeof key === 'string' ? key : 'mock-public-key',
      toString: () => typeof key === 'string' ? key : 'mock-public-key',
    })),
  };
});

// Mock bs58 to avoid actual encoding/decoding
jest.mock('bs58', () => ({
  encode: jest.fn().mockReturnValue('mock-base58-encoded-string'),
  decode: jest.fn().mockReturnValue(new Uint8Array(64).fill(1)),
}));

// Mock nacl for signature verification
jest.mock('tweetnacl', () => {
  return {
    sign: {
      detached: jest.fn().mockReturnValue(new Uint8Array(64).fill(1)),
    },
  };
});

// Add the verify function to the mocked nacl
const mockedNacl = require('tweetnacl');
mockedNacl.sign.detached.verify = jest.fn().mockReturnValue(true);

describe('SolanaKeypairWalletProvider', () => {
  let wallet: SolanaKeypairWalletProvider;
  let keypair: Keypair;

  beforeEach(() => {
    // Generate a new keypair for each test
    keypair = Keypair.generate();
    wallet = new SolanaKeypairWalletProvider({
      keypair: new Uint8Array(64).fill(1), // Mock secret key
      rpcUrl: 'https://api.devnet.solana.com',
    });
  });

  describe('constructor', () => {
    it('should create a wallet from a Uint8Array secret key', () => {
      const wallet = new SolanaKeypairWalletProvider({
        keypair: new Uint8Array(64).fill(1),
        rpcUrl: 'https://api.devnet.solana.com',
      });
      expect(wallet.getAddress()).toBe('mock-public-key');
    });

    it('should create a wallet from a base58 encoded secret key', () => {
      const wallet = new SolanaKeypairWalletProvider({
        keypair: 'mock-base58-key',
        rpcUrl: 'https://api.devnet.solana.com',
      });
      expect(wallet.getAddress()).toBe('mock-public-key');
    });
  });

  describe('static factory methods', () => {
    it('should create a wallet from an RPC URL', async () => {
      const wallet = await SolanaKeypairWalletProvider.fromRpcUrl(
        'https://api.devnet.solana.com',
        new Uint8Array(64).fill(1)
      );
      expect(wallet.getAddress()).toBe('mock-public-key');
    });

    it('should create a wallet from a Connection', async () => {
      const connection = new Connection('https://api.devnet.solana.com');
      const wallet = await SolanaKeypairWalletProvider.fromConnection(
        connection,
        new Uint8Array(64).fill(1)
      );
      expect(wallet.getAddress()).toBe('mock-public-key');
    });
  });

  describe('getAddress', () => {
    it('should return the correct address', () => {
      expect(wallet.getAddress()).toBe('mock-public-key');
    });
  });

  describe('getBalance', () => {
    it('should return the wallet balance', async () => {
      const balance = await wallet.getBalance();
      expect(balance).toBe(BigInt(1000000000)); // 1 SOL
    });
  });

  describe('signMessage', () => {
    it('should sign a string message', async () => {
      const message = 'Hello, world!';
      const signature = await wallet.signMessage(message);
      expect(signature).toBe('mock-base58-encoded-string');
    });

    it('should sign a Uint8Array message', async () => {
      const messageBytes = new TextEncoder().encode('Hello, world!');
      const signature = await wallet.signMessage(messageBytes);
      expect(signature).toBe('mock-base58-encoded-string');
    });
  });

  describe('transaction operations', () => {
    let mockTransaction: VersionedTransaction;

    beforeEach(() => {
      // Create a mock transaction with a dummy message
      mockTransaction = new VersionedTransaction(
        // Pass a mock message to the constructor
        {} as any
      );
    });

    describe('signTransaction', () => {
      it('should sign a transaction', async () => {
        const signedTx = await wallet.signTransaction(mockTransaction);
        expect(mockTransaction.sign).toHaveBeenCalled();
        expect(signedTx).toBe(mockTransaction);
      });
    });

    describe('sendTransaction', () => {
      it('should send a transaction', async () => {
        const signature = await wallet.sendTransaction(mockTransaction);
        expect(signature).toBe('mock-signature');
      });
    });

    describe('signAndSendTransaction', () => {
      it('should sign and send a transaction', async () => {
        const signSpy = jest.spyOn(wallet, 'signTransaction');
        const sendSpy = jest.spyOn(wallet, 'sendTransaction');
        
        const signature = await wallet.signAndSendTransaction(mockTransaction);
        
        expect(signSpy).toHaveBeenCalledWith(mockTransaction);
        expect(sendSpy).toHaveBeenCalled();
        expect(signature).toBe('mock-signature');
      });
    });
  });

  describe('nativeTransfer', () => {
    it('should transfer SOL to another address', async () => {
      const toAddress = 'mock-recipient-address';
      const signature = await wallet.nativeTransfer(toAddress, '0.001');
      expect(signature).toBe('mock-signature');
    });

    it('should throw an error if balance is insufficient', async () => {
      // Mock getBalance to return a low balance
      jest.spyOn(wallet, 'getBalance').mockResolvedValueOnce(BigInt(1000));
      
      const toAddress = 'mock-recipient-address';
      await expect(wallet.nativeTransfer(toAddress, '0.001')).rejects.toThrow('Insufficient balance');
    });
  });

  describe('requestAirdrop', () => {
    it('should request an airdrop', async () => {
      const signature = await wallet.requestAirdrop(1000000000); // 1 SOL
      expect(signature).toBe('mock-airdrop-signature');
    });
  });

  describe('waitForTransactionConfirmation', () => {
    it('should wait for transaction confirmation', async () => {
      const result = await wallet.waitForTransactionConfirmation('mock-signature');
      expect(result).toEqual({
        context: { slot: 1 },
        value: { err: null },
      });
    });
  });

  describe('getSignatureStatus', () => {
    it('should get the signature status', async () => {
      const status = await wallet.getSignatureStatus('mock-signature');
      expect(status).toEqual({
        context: { slot: 1 },
        value: { slot: 1, confirmations: 1, err: null, confirmationStatus: 'confirmed' },
      });
    });
  });

  describe('getName', () => {
    it('should return the wallet provider name', () => {
      expect(wallet.getName()).toBe('solana_keypair_wallet_provider');
    });
  });
});
