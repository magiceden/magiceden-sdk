import { ETH_DECIMALS, USDC_CONTRACTS, USDC_DECIMALS, WETH_CONTRACTS } from '../../constants/evm/contracts';
import { OTHER_PAYMENT_TOKENS, ZERO_ADDRESS } from '../../constants/evm/payment';
import { EvmBlockchain } from '../../types/chains/evm';
import { EvmPaymentToken, PaymentTokenWithoutChain } from '../../types/evm';
import { getCurrencyForChain } from '../currency';
import { getEvmChainIdFromBlockchain } from './chain';

// Adds native currency, WETH, and USDC.
function getBaselinePaymentCurrencies(
  chain: EvmBlockchain,
  includeNative = true,
): PaymentTokenWithoutChain[] {
  const nativeCurrency = getCurrencyForChain(chain);
  const tokens: PaymentTokenWithoutChain[] = [];
  if (includeNative) {
    tokens.push({
      address: ZERO_ADDRESS,
      decimals: nativeCurrency.decimals,
      symbol: nativeCurrency.symbol,
      name: nativeCurrency.displayName,
    });
  }
  const wethAddress = WETH_CONTRACTS[chain];
  if (wethAddress) {
    tokens.push({
      address: wethAddress,
      decimals: ETH_DECIMALS,
      symbol: 'WETH',
      name: 'WETH',
    });
  }
  const usdcAddress = USDC_CONTRACTS[chain];
  if (usdcAddress) {
    tokens.push({
      address: usdcAddress,
      decimals: USDC_DECIMALS,
      symbol: 'USDC',
      name: 'USD Coin',
    });
  }
  return tokens;
}

export function getPaymentTokensForEvmChain(chain: EvmBlockchain): EvmPaymentToken[] {
  const tokens: PaymentTokenWithoutChain[] = getBaselinePaymentCurrencies(chain);
  tokens.push(...OTHER_PAYMENT_TOKENS[chain]);
  return tokens.map((token) => ({
    ...token,
    chainId: getEvmChainIdFromBlockchain(chain),
  }));
}
