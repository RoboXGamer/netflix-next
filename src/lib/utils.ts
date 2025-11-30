import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<Func extends (...args: any[]) => void>(
  fn: Func,
  wait = 800
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  function debounced(this: unknown, ...args: Parameters<Func>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, wait);
  }

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced as typeof debounced & { cancel: () => void };
}

export async function fetchWithRetry(
  url: string,
  options?: RequestInit & { next?: { revalidate?: number } },
  maxRetries = 5,
  initialDelay = 500
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      lastError = error as Error;

      const errorMessage = error instanceof Error ? error.message : "";
      const causeMessage =
        error instanceof Error && error.cause instanceof Error
          ? error.cause.message
          : "";

      const isRetryable =
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("ETIMEDOUT") ||
        errorMessage.includes("ENOTFOUND") ||
        errorMessage.includes("ECONNREFUSED") ||
        errorMessage.includes("socket hang up") ||
        causeMessage.includes("ECONNRESET") ||
        causeMessage.includes("ETIMEDOUT") ||
        causeMessage.includes("socket hang up");

      if (!isRetryable || attempt === maxRetries - 1) {
        break;
      }

      const delay = initialDelay * Math.pow(2, attempt);
      console.warn(
        `[fetchWithRetry] Attempt ${
          attempt + 1
        }/${maxRetries} failed: ${errorMessage}. Retrying in ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
