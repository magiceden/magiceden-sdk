import { z } from 'zod';

export enum EvmProtocolType {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  ERC20 = 'ERC20',
}

export enum SolProtocolType {
  SPL = 'SPL',
  METAPLEX_CORE = 'METAPLEX_CORE',
}

export const TokenProtocolType = z.union([
  z.nativeEnum(EvmProtocolType),
  z.nativeEnum(SolProtocolType),
]);
export type TokenProtocolType = z.infer<typeof TokenProtocolType>;

export const EvmNonFungibleProtocolTypes = z.enum([
  EvmProtocolType.ERC721,
  EvmProtocolType.ERC1155,
]);
export type EvmNonFungibleProtocolType = z.infer<typeof EvmNonFungibleProtocolTypes>;
