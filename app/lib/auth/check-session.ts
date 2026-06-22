import { auth } from "@/app/lib/auth/auth";
import { headers } from "next/headers";

export async function checkSession() {
  return auth.api.getSession({ headers: await headers() });
}
