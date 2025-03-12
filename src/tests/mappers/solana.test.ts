import { SolanaNftApiMappers } from '../../mappers/nft/solana';
import { SplAmount } from '../../types/solana';

describe('SolanaNftApiMappers', () => {
  describe('listRequest', () => {
    it('should correctly map list parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        price: 1000000000,
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenAccount: 'tokenAccount123',
        expiry: 1234567890,
        sellerReferral: 'referral123',
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500,
        txFeePayer: 'feePayer123'
      };

      const result = SolanaNftApiMappers.listRequest(params);

      expect(result).toEqual({
        tokenMint: 'tokenMintAddress123',
        price: 1000000000,
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenAccount: 'tokenAccount123',
        expiry: 1234567890,
        sellerReferral: 'referral123',
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500,
        txFeePayer: 'feePayer123'
      });
    });

    it('should handle optional parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        price: 1000000000,
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenAccount: 'tokenAccount123',
        expiry: 1234567890
      };

      const result = SolanaNftApiMappers.listRequest(params);

      expect(result.sellerReferral).toBeUndefined();
      expect(result.prioFeeMicroLamports).toBeUndefined();
      expect(result.maxPrioFeeLamports).toBeUndefined();
      expect(result.exactPrioFeeLamports).toBeUndefined();
      expect(result.txFeePayer).toBeUndefined();
    });

    it('should correctly map SPL token price', () => {
      const splPrice: SplAmount = {
        address: 'splTokenMint123',
        rawAmount: BigInt(1000000),
        decimals: 9
      };

      const params = {
        tokenAddress: 'tokenMintAddress123',
        price: 1000000000,
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenAccount: 'tokenAccount123',
        expiry: 1234567890,
        splPrice
      };

      const result = SolanaNftApiMappers.listRequest(params);

      expect(result.splPrice).toEqual(splPrice);
    });
  });

  describe('cancelListingRequest', () => {
    it('should correctly map cancel listing parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        price: 1000000000,
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenAccount: 'tokenAccount123',
        expiry: 1234567890,
        sellerReferral: 'referral123',
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500
      };

      const result = SolanaNftApiMappers.cancelListingRequest(params);

      expect(result).toEqual({
        tokenMint: 'tokenMintAddress123',
        price: 1000000000,
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenAccount: 'tokenAccount123',
        expiry: 1234567890,
        sellerReferral: 'referral123',
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500
      });
    });

    it('should handle optional parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        price: 1000000000,
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenAccount: 'tokenAccount123',
        expiry: 1234567890
      };

      const result = SolanaNftApiMappers.cancelListingRequest(params);

      expect(result.sellerReferral).toBeUndefined();
      expect(result.prioFeeMicroLamports).toBeUndefined();
      expect(result.maxPrioFeeLamports).toBeUndefined();
      expect(result.exactPrioFeeLamports).toBeUndefined();
    });
  });

  describe('makeItemOfferRequest', () => {
    it('should correctly map make item offer parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        price: 1000000000,
        buyer: 'buyerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        buyerReferral: 'referral123',
        expiry: 1234567890,
        useBuyV2: true,
        buyerCreatorRoyaltyPercent: 5,
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500
      };

      const result = SolanaNftApiMappers.makeItemOfferRequest(params);

      expect(result).toEqual({
        tokenMint: 'tokenMintAddress123',
        price: 1000000000,
        buyer: 'buyerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        buyerReferral: 'referral123',
        expiry: 1234567890,
        useBuyV2: true,
        buyerCreatorRoyaltyPercent: 5,
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500
      });
    });

    it('should handle optional parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        price: 1000000000,
        buyer: 'buyerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        expiry: 1234567890
      };

      const result = SolanaNftApiMappers.makeItemOfferRequest(params);

      expect(result.buyerReferral).toBeUndefined();
      expect(result.useBuyV2).toBeUndefined();
      expect(result.buyerCreatorRoyaltyPercent).toBeUndefined();
      expect(result.prioFeeMicroLamports).toBeUndefined();
      expect(result.maxPrioFeeLamports).toBeUndefined();
      expect(result.exactPrioFeeLamports).toBeUndefined();
    });
  });

  describe('cancelItemOfferRequest', () => {
    it('should correctly map cancel item offer parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        price: 1000000000,
        buyer: 'buyerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        buyerReferral: 'referral123',
        expiry: 1234567890,
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500
      };

      const result = SolanaNftApiMappers.cancelItemOfferRequest(params);

      expect(result).toEqual({
        tokenMint: 'tokenMintAddress123',
        price: 1000000000,
        buyer: 'buyerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        buyerReferral: 'referral123',
        expiry: 1234567890,
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500
      });
    });

    it('should handle optional parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        price: 1000000000,
        buyer: 'buyerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        expiry: 1234567890
      };

      const result = SolanaNftApiMappers.cancelItemOfferRequest(params);

      expect(result.buyerReferral).toBeUndefined();
      expect(result.prioFeeMicroLamports).toBeUndefined();
      expect(result.maxPrioFeeLamports).toBeUndefined();
      expect(result.exactPrioFeeLamports).toBeUndefined();
    });
  });

  describe('takeItemOfferRequest', () => {
    it('should correctly map take item offer parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        buyer: 'buyerAddress123',
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenATA: 'tokenATA123',
        price: 1000000000,
        newPrice: 1100000000,
        buyerReferral: 'buyerReferral123',
        sellerReferral: 'sellerReferral123',
        buyerExpiry: 1234567890,
        sellerExpiry: 1234567891,
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500
      };

      const result = SolanaNftApiMappers.takeItemOfferRequest(params);

      expect(result).toEqual({
        tokenMint: 'tokenMintAddress123',
        buyer: 'buyerAddress123',
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenATA: 'tokenATA123',
        price: 1000000000,
        newPrice: 1100000000,
        buyerReferral: 'buyerReferral123',
        sellerReferral: 'sellerReferral123',
        buyerExpiry: 1234567890,
        sellerExpiry: 1234567891,
        prioFeeMicroLamports: 5000,
        maxPrioFeeLamports: 10000,
        exactPrioFeeLamports: 7500
      });
    });

    it('should handle optional parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        buyer: 'buyerAddress123',
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenATA: 'tokenATA123',
        newPrice: 1100000000,
        sellerExpiry: 1234567891
      };

      const result = SolanaNftApiMappers.takeItemOfferRequest(params);

      expect(result.price).toBeUndefined();
      expect(result.buyerReferral).toBeUndefined();
      expect(result.sellerReferral).toBeUndefined();
      expect(result.buyerExpiry).toBeUndefined();
      expect(result.prioFeeMicroLamports).toBeUndefined();
      expect(result.maxPrioFeeLamports).toBeUndefined();
      expect(result.exactPrioFeeLamports).toBeUndefined();
    });
  });

  describe('buyRequest', () => {
    it('should correctly map buy parameters', () => {
      const splPrice: SplAmount = {
        address: 'splTokenMint123',
        rawAmount: BigInt(1000000),
        decimals: 9
      };

      const params = {
        tokenAddress: 'tokenMintAddress123',
        buyer: 'buyerAddress123',
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenATA: 'tokenATA123',
        price: 1000000000,
        buyerReferral: 'buyerReferral123',
        sellerReferral: 'sellerReferral123',
        buyerExpiry: 1234567890,
        sellerExpiry: 1234567891,
        buyerCreatorRoyaltyPercent: 5,
        splPrice
      };

      const result = SolanaNftApiMappers.buyRequest(params);

      expect(result).toEqual({
        tokenMint: 'tokenMintAddress123',
        buyer: 'buyerAddress123',
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenATA: 'tokenATA123',
        price: 1000000000,
        buyerReferral: 'buyerReferral123',
        sellerReferral: 'sellerReferral123',
        buyerExpiry: 1234567890,
        sellerExpiry: 1234567891,
        buyerCreatorRoyaltyPercent: 5,
        splPrice
      });
    });

    it('should handle optional parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        buyer: 'buyerAddress123',
        seller: 'sellerAddress123',
        auctionHouseAddress: 'auctionHouse123',
        tokenATA: 'tokenATA123',
        price: 1000000000,
        sellerExpiry: 1234567891
      };

      const result = SolanaNftApiMappers.buyRequest(params);

      expect(result.buyerReferral).toBeUndefined();
      expect(result.sellerReferral).toBeUndefined();
      expect(result.buyerExpiry).toBeUndefined();
      expect(result.buyerCreatorRoyaltyPercent).toBeUndefined();
      expect(result.splPrice).toBeUndefined();
    });
  });

  describe('transferRequest', () => {
    it('should correctly map transfer parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        from: 'fromAddress123',
        to: 'toAddress123',
        isCompressed: true
      };

      const result = SolanaNftApiMappers.transferRequest(params);

      expect(result).toEqual({
        mint: 'tokenMintAddress123',
        from: 'fromAddress123',
        to: 'toAddress123',
        isCompressed: true
      });
    });

    it('should handle optional parameters', () => {
      const params = {
        tokenAddress: 'tokenMintAddress123',
        from: 'fromAddress123',
        to: 'toAddress123'
      };

      const result = SolanaNftApiMappers.transferRequest(params);

      expect(result.isCompressed).toBeUndefined();
    });
  });
});
