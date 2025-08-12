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

      try {
        const data = await response.json();

        if (!response.ok) {
          // we have an structured json error from the server
          switch (response.status) {
            case 400:
              throw new BadRequestError({
                status: response.status,
                message: data.message ?? 'Unknown error occurred',
                request_id: data.request_id,
              });
            case 401:
              throw new UnauthorizedError({
                status: response.status,
                message: data.message ?? 'Unknown error occurred',
                request_id: data.request_id,
              });
            case 404:
              throw new NotFoundError({
                status: response.status,
                message: data.message ?? 'Unknown error occurred',
                request_id: data.request_id,
              });
            case 500:
              throw new InternalServerError({
                status: response.status,
                message: data.message ?? 'Unknown error occurred',
                request_id: data.request_id,
              });
            default:
              throw new MeritError({
                status: response.status,
                message: data.message ?? 'Unknown error occurred',
                request_id: data.request_id,
              });
          }
        }
        return data;
      } catch {
        switch (response.status) {
          case 400:
            throw new BadRequestError({
              status: response.status,
              message: response.statusText ?? 'Unknown error occurred',
            });
          case 401:
            throw new UnauthorizedError({
              status: response.status,
              message: response.statusText ?? 'Unknown error occurred',
            });
          case 404:
            throw new NotFoundError({
              status: response.status,
              message: response.statusText ?? 'Unknown error occurred',
            });
          case 500:
            throw new InternalServerError({
              status: response.status,
              message: response.statusText ?? 'Unknown error occurred',
            });
          default:
            throw new MeritError({
              status: response.status,
              message: response.statusText ?? 'Unknown error occurred',
            });
        }
      }
    } catch (error) {
      throw new MeritError({
        status: 0,
        message:
          error instanceof Error ? error.message : 'Network request failed',
      });
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
