import { isAddress } from 'viem';
import { z } from 'zod';

const VALID_EVM_ADDRESS = /^(((0x)?[0-9a-fA-F]{40})|(XE[0-9]{2}[0-9A-Za-z]{30,31}))$/;

export const zEVMAddress = z.string().regex(VALID_EVM_ADDRESS);

export const EVMAddressSchema = z.string().superRefine((addr, ctx) => {
  if (!isValidEvmAddress(addr)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid EVM address: ${addr}`,
    });
  }
  return z.NEVER;
});
export type EVMAddress = z.infer<typeof EVMAddressSchema>;

export const EVMAddressToLowerCaseSchema = EVMAddressSchema.transform((addr) => addr.toLowerCase());

export function isValidEvmAddress(address: string) {
  return isAddress(address);
}
