import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { AdminPrincipal } from "./../auth";
import { authenticateRequest } from "./../auth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AdminPrincipal | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: AdminPrincipal | null = null;

  try {
    user = await authenticateRequest(opts.req);
  } catch (error) {
    // المصادقة اختيارية للإجراءات العلنية؛ نُسقط إلى null.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
