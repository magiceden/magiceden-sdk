import { z } from 'zod';

const VALID_EVM_ADDRESS = /^(((0x)?[0-9a-fA-F]{40})|(XE[0-9]{2}[0-9A-Za-z]{30,31}))$/;

export const zEVMAddress = z.string().regex(VALID_EVM_ADDRESS);
