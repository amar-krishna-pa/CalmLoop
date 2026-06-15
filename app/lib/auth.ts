import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/app/lib/db";
import * as schema from "@/app/lib/db/schema";
import { passkey } from "@better-auth/passkey";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    passkey({
      registration: {
        requireSession: false,
        resolveUser: async ({ context }) => {
          const { name, email } = JSON.parse(context as string) as {
            name: string;
            email: string;
          };

          const [existing] = await db
            .select()
            .from(schema.user)
            .where(eq(schema.user.email, email))
            .limit(1);

          if (existing) {
            return { id: existing.id, name: existing.name };
          }

          const id = crypto.randomUUID();
          await db.insert(schema.user).values({
            id,
            name,
            email,
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          return { id, name };
        },
      },
    }),
  ],
});
