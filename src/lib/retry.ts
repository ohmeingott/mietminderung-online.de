/**
 * Retry utility with exponential backoff and timeouts for external API calls.
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
  retryOn?: (error: unknown) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  timeoutMs: 30000,
  retryOn: () => true,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), opts.timeoutMs);

    try {
      const result = await fn(controller.signal);
      clearTimeout(timeout);
      return result;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;

      const isLastAttempt = attempt === opts.maxRetries;
      if (isLastAttempt || !opts.retryOn(error)) {
        throw error;
      }

      const delay = Math.min(
        opts.initialDelayMs * Math.pow(2, attempt),
        opts.maxDelayMs
      );
      const jitter = delay * (0.5 + Math.random() * 0.5);
      await sleep(jitter);
    }
  }

  throw lastError;
}

/**
 * Wrapper for fetch with timeout support.
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = 30000, ...fetchInit } = init;
  const controller = new AbortController();

  if (fetchInit.signal) {
    fetchInit.signal.addEventListener("abort", () => controller.abort());
  }

  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchInit,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Determines if an error is retryable (network errors, 5xx, 429).
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true; // Network error
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return true; // Timeout
  }
  return false;
}

/**
 * Determines if an HTTP response status is retryable.
 */
export function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}
