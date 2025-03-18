import { RESERVOIR_CONFIGS, ReservoirConfig } from "../../constants/evm/reservoir";
import { EvmBlockchain } from "../../types/chains/evm";

export function getReservoirConfigForChain(chain: EvmBlockchain): ReservoirConfig {
  return RESERVOIR_CONFIGS[chain];
}
