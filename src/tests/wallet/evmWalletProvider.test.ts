import { Blockchain } from '../../types/chains/general';
import { MockEvmWalletProvider } from '../../wallet/evm/mockEvmWalletProvider';
import { ViemWalletProvider } from '../../wallet/evm/viemWalletProvider';
import { TransactionRequest, WalletClient, createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Mock viem library
jest.mock('viem', () => {
  const original = jest.requireActual('viem');
  
  // Mock WalletClient
  const mockWalletClient = {
    account: {
      address: '0xmockAddress',
      type: 'json-rpc',
    },
    chain: { id: 1, name: 'Ethereum' },
    signMessage: jest.fn().mockResolvedValue('0xmockSignature'),
    signTransaction: jest.fn().mockResolvedValue('0xmockSignedTx'),
    sendTransaction: jest.fn().mockResolvedValue('0xmockTxHash'),
    signTypedData: jest.fn().mockResolvedValue('0xmockTypedDataSignature'),
  };
  
  // Mock PublicClient
  const mockPublicClient = {
    getBalance: jest.fn().mockResolvedValue(BigInt(1000000000000000000)), // 1 ETH
    estimateGas: jest.fn().mockResolvedValue(BigInt(21000)),
    estimateFeesPerGas: jest.fn().mockResolvedValue({
      maxFeePerGas: BigInt(30000000000),
      maxPriorityFeePerGas: BigInt(1500000000),
    }),
    waitForTransactionReceipt: jest.fn().mockResolvedValue({
      status: 'success',
      transactionHash: '0xmockTxHash',
      blockHash: '0xmockBlockHash',
      blockNumber: BigInt(123456),
      from: '0xmockAddress',
      to: '0xmockRecipient',
      contractAddress: null,
      effectiveGasPrice: BigInt(25000000000),
      gasUsed: BigInt(21000),
      logs: [],
      logsBloom: '0x',
      type: 2,
      cumulativeGasUsed: BigInt(21000),
      transactionIndex: 0,
    }),
    readContract: jest.fn().mockResolvedValue(123),
  };
  
  return {
    ...original,
    createWalletClient: jest.fn().mockReturnValue(mockWalletClient),
    createPublicClient: jest.fn().mockReturnValue(mockPublicClient),
  };
});

// Mock viem/chains
jest.mock('viem/chains', () => ({
  mainnet: { id: 1, name: 'Ethereum' },
}));

describe('EvmWalletProvider', () => {
  describe('MockEvmWalletProvider', () => {
    let wallet: MockEvmWalletProvider;

    beforeEach(() => {
      wallet = new MockEvmWalletProvider();
    });

    it('should return a mock address', () => {
      expect(wallet.getAddress()).toBe('0x123');
    });

    it('should return a mock balance', async () => {
      const balance = await wallet.getBalance();
      expect(balance).toBe(BigInt(1000000));
    });

    it('should sign a message', async () => {
      const signature = await wallet.signMessage('Hello, world!');
      expect(signature).toBe('0x123');
    });

    it('should sign a transaction', async () => {
      const tx = {} as TransactionRequest;
      const signedTx = await wallet.signTransaction(tx);
      expect(signedTx).toBe('0x123');
    });

    it('should sign and send a transaction', async () => {
      const tx = {} as TransactionRequest;
      const txHash = await wallet.signAndSendTransaction(tx);
      expect(txHash).toBe('0x123');
    });

    it('should wait for transaction confirmation', async () => {
      const receipt = await wallet.waitForTransactionConfirmation('0x123');
      expect(receipt).toEqual({
        txId: '0x123',
        status: 'confirmed',
      });
    });

    it('should sign typed data', async () => {
      const typedData = {};
      const signature = await wallet.signTypedData(typedData);
      expect(signature).toBe('0x123');
    });

    it('should read contract', async () => {
      const params = {};
      const result = await wallet.readContract(params);
      expect(result).toEqual({});
    });
  });

  describe('ViemWalletProvider', () => {
    let wallet: ViemWalletProvider;
    let walletClient: WalletClient;

    beforeEach(() => {
      walletClient = createWalletClient({
        chain: mainnet,
        transport: http(),
      });
      
      wallet = new ViemWalletProvider({
        privateKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
        blockchain: Blockchain.BASE,
        options: {
          gas: {
            limitMultiplier: 1.2,
            feeMultiplier: 1.1,
          },
        },
      });
    });

    describe('constructor', () => {
      it('should create a wallet with default gas options', () => {
        const defaultWallet = new ViemWalletProvider({
          privateKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
          blockchain: Blockchain.BASE,
        });
        expect(defaultWallet).toBeInstanceOf(ViemWalletProvider);
      });

      it('should create a wallet with custom gas options', () => {
        const customWallet = new ViemWalletProvider({
          privateKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
          blockchain: Blockchain.BASE,
          options: {
            gas: {
              limitMultiplier: 1.5,
              feeMultiplier: 1.3,
            },
          },
        });
        expect(customWallet).toBeInstanceOf(ViemWalletProvider);
      });
    });

    describe('getAddress', () => {
      it('should return the correct address', () => {
        expect(wallet.getAddress()).toBe('0xmockAddress');
      });
    });

    describe('getBalance', () => {
      it('should return the wallet balance', async () => {
        const balance = await wallet.getBalance();
        expect(balance).toBe(BigInt(1000000000000000000)); // 1 ETH
      });
    });

    describe('signMessage', () => {
      it('should sign a message', async () => {
        const message = 'Hello, world!';
        const signature = await wallet.signMessage(message);
        expect(signature).toBe('0xmockSignature');
        expect(walletClient.signMessage).toHaveBeenCalledWith({
          account: walletClient.account,
          message,
        });
      });
    });

    describe('signTypedData', () => {
      it('should sign typed data', async () => {
        const typedData = {
          domain: { name: 'Test' },
          types: { Person: [{ name: 'name', type: 'string' }] },
          primaryType: 'Person',
          message: { name: 'Alice' },
        };
        
        const signature = await wallet.signTypedData(typedData);
        
        expect(signature).toBe('0xmockTypedDataSignature');
        expect(walletClient.signTypedData).toHaveBeenCalledWith({
          account: walletClient.account,
          domain: typedData.domain,
          types: typedData.types,
          primaryType: typedData.primaryType,
          message: typedData.message,
        });
      });
    });

    describe('signTransaction', () => {
      it('should sign a transaction', async () => {
        const tx: TransactionRequest = {
          to: '0xrecipient',
          value: BigInt(1000000000000000),
          data: '0xdata',
        };
        
        const signedTx = await wallet.signTransaction(tx);
        
        expect(signedTx).toBe('0xmockSignedTx');
        expect(walletClient.signTransaction).toHaveBeenCalledWith({
          account: walletClient.account,
          to: tx.to,
          value: tx.value,
          data: tx.data,
          chain: walletClient.chain,
        });
      });
    });

    describe('signAndSendTransaction', () => {
      it('should sign and send a transaction', async () => {
        const tx: TransactionRequest = {
          to: '0xrecipient',
          value: BigInt(1000000000000000),
          data: '0xdata',
        };
        
        const txHash = await wallet.signAndSendTransaction(tx);
        
        expect(txHash).toBe('0xmockTxHash');
        expect(walletClient.sendTransaction).toHaveBeenCalled();
      });
    });

    describe('waitForTransactionConfirmation', () => {
      it('should wait for transaction confirmation', async () => {
        const receipt = await wallet.waitForTransactionConfirmation('0xmockTxHash');
        
        expect(receipt).toEqual({
          txId: '0xmockTxHash',
          status: 'confirmed',
          error: undefined,
          metadata: {
            from: '0xmockAddress',
            to: '0xmockRecipient',
            contractAddress: null,
            status: 'success',
            transactionHash: '0xmockTxHash',
            blockHash: '0xmockBlockHash',
            blockNumber: BigInt(123456),
            transactionIndex: 0,
            logs: [],
            logsBloom: '0x',
            type: 2,
            gasUsed: BigInt(21000),
            effectiveGasPrice: BigInt(25000000000),
            cumulativeGasUsed: BigInt(21000),
          },
        });
      });
    });

    describe('readContract', () => {
      it('should read a contract', async () => {
        const params = {
          address: '0xcontract' as `0x${string}`,
          abi: [{ 
            name: 'balanceOf', 
            type: 'function',
            inputs: [{ name: 'owner', type: 'address' }],
            outputs: [{ name: 'balance', type: 'uint256' }],
            stateMutability: 'view'
          }],
          functionName: 'balanceOf',
          args: ['0xuser' as `0x${string}`],
        };
        
        const result = await wallet.readContract(params);
        
        expect(result).toBe(123);
      });
    });

    describe('error handling', () => {
      it('should throw error when no account is connected', async () => {
        // Create a wallet client with no account
        const noAccountClient = createWalletClient({
          chain: mainnet,
          transport: http(),
        });
        
        // Override the account property
        Object.defineProperty(noAccountClient, 'account', {
          value: null,
        });
        
        const noAccountWallet = new ViemWalletProvider({
          privateKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
          blockchain: Blockchain.BASE,
        });
        
        await expect(noAccountWallet.getBalance()).rejects.toThrow('No account connected to wallet');
      });
    });
  });
});
