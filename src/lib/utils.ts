import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Client, createClient } from "@libsql/client/http";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function tursoClient(): Client {
  const url = process.env.NEXT_PUBLIC_TURSO_DB_URL?.trim();
  if (url === undefined) {
    throw new Error("TURSO_DB_URL is not defined");
  }

  const authToken = process.env.NEXT_PUBLIC_TURSO_DB_AUTH_TOKEN?.trim();
  if (authToken === undefined) {
    if (!url.includes("file:")) {
      throw new Error("TURSO_DB_AUTH_TOKEN is not defined");
    }
  }

  return createClient({
    url: process.env.NEXT_PUBLIC_TURSO_DB_URL as string,
    authToken: process.env.NEXT_PUBLIC_TURSO_DB_AUTH_TOKEN as string,
  });
}

export const turso = tursoClient();

// Function to check if email ends with a specific domain
export function isEndWithUCSPyayDomain(email: string) {
  // Construct the regular expression pattern
  const pattern = new RegExp(
    `@${process.env.NEXT_PUBLIC_VALID_EMAIL_DOMAIN}$`,
    "i"
  );

  // Test if the email matches the pattern
  return pattern.test(email);
}
