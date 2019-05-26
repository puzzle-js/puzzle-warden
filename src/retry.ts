import {NextHandler, RequestChunk, ResponseChunk, Streamer} from "./streamer";
import {StreamType} from "./stream-factory";

interface RetryDecoratedResponse extends ResponseChunk {
  retryCount: number;
}

interface RetryDecoratedRequest extends RequestChunk {
  retryCount: number;
}

interface RetryConfiguration {
  count: number;
  delay: number;
  logger?: (retry: number) => void;
}

interface RetryInputConfiguration {
  count?: number;
  delay?: number;
  logger?: (retry: number) => void;
}

const DEFAULT_RETRY_CONFIGURATION = {
  count: 1,
  delay: 100,
};

const RETRYABLE_ERRORS = ['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN'];

class Retry extends Streamer {
  private configuration: RetryConfiguration;

  constructor(configuration: RetryConfiguration) {
    super(StreamType.RETRY);

    this.configuration = configuration;
  }

  static create(configuration: RetryInputConfiguration | true | number) {
    if (typeof configuration === "boolean") {
      return new Retry(DEFAULT_RETRY_CONFIGURATION);
    } else if (typeof configuration === "number") {
      return new Retry({
        count: configuration,
        delay: 0
      });
    } else if (typeof configuration === "object") {
      const count = configuration.count || 1;
      const delay = configuration.delay || 0;
      return new Retry({
        count,
        delay,
        logger: configuration.logger
      });
    } else {
      return new Retry(DEFAULT_RETRY_CONFIGURATION);
    }
  }

  async onResponse(chunk: RetryDecoratedResponse, next: NextHandler): Promise<void> {
    if (chunk.retryCount <= this.configuration.count && this.shouldRetry(chunk)) {
      if (this.configuration.delay > 0) {
        setTimeout(() => {
          this.retry(chunk);
        }, this.configuration.delay);
      } else {
        this.retry(chunk);
      }
    } else {
      next(chunk);
    }
  }

  async onRequest(chunk: RetryDecoratedRequest, next: NextHandler): Promise<void> {
    next({
      ...chunk,
      retryCount: 0
    } as RequestChunk);
  }

  private retry(chunk: RetryDecoratedResponse) {
    if (this.configuration.logger) this.configuration.logger(chunk.retryCount + 1);
    this.request<RetryDecoratedRequest>({
      retryCount: chunk.retryCount + 1,
      cb: chunk.cb,
      key: chunk.key,
      id: chunk.id,
      requestOptions: chunk.requestOptions
    });
  }

  private shouldRetry(chunk: RetryDecoratedResponse) {
    const statusCode = chunk.response ? chunk.response.statusCode : null;

    if (statusCode && (statusCode === 429 || (500 <= statusCode && statusCode < 600))) {
      return true;
    }

    if (chunk.error) {
      return RETRYABLE_ERRORS.includes(chunk.error.code);
    }

    return false;
  }
}

export {
  RetryInputConfiguration,
  RetryConfiguration,
  Retry
};