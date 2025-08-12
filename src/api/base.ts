import {
  BadRequestError,
  InternalServerError,
  MeritError,
  NotFoundError,
  UnauthorizedError,
  type APIResponse,
} from '../types.js';

export abstract class BaseAPI {
  protected readonly apiKey: string;
  protected readonly baseURL: string;

  constructor(apiKey: string, baseURL: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  protected async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      // Handle non-2xx responses
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      // Re-throw Merit errors as-is
      if (error instanceof MeritError) {
        throw error;
      }

      // Network-level errors
      throw new MeritError({
        status: 0,
        message:
          error instanceof Error ? error.message : 'Network request failed',
      });
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = 'Unknown error occurred';
    let requestId: string | undefined;

    // Try to parse JSON error response
    try {
      const errorData = await response.json();
      errorMessage = errorData.message ?? errorMessage;
      requestId = errorData.request_id;
    } catch {
      // Fallback to status text if JSON parsing fails
      errorMessage = response.statusText || errorMessage;
    }

    const errorInfo = {
      status: response.status,
      message: errorMessage,
      request_id: requestId,
    };

    switch (response.status) {
      case 400:
        throw new BadRequestError(errorInfo);
      case 401:
        throw new UnauthorizedError(errorInfo);
      case 404:
        throw new NotFoundError(errorInfo);
      case 500:
        throw new InternalServerError(errorInfo);
      default:
        throw new MeritError(errorInfo);
    }
  }

  protected async postRequest<T>(
    endpoint: string,
    body?: unknown
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            status: response.status,
            message: data.message ?? 'Unknown error occurred',
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          status: 0,
          message:
            error instanceof Error ? error.message : 'Network request failed',
        },
      };
    }
  }
}
