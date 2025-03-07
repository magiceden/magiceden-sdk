import axios, { AxiosError } from 'axios';
import { ApiManager } from '../../../api/utils/apimanager';
import { 
  ApiError, 
  NetworkError, 
  AuthenticationError, 
  RateLimitError 
} from '../../../errors';

// Mock axios to control responses
jest.mock('axios', () => {
  // Define the type explicitly
  const mockAxios: any = {
    create: jest.fn((): any => mockAxios),
    interceptors: {
      response: {
        use: jest.fn((successFn, errorFn) => {
          mockAxios.interceptorSuccessFn = successFn;
          mockAxios.interceptorErrorFn = errorFn;
          return mockAxios;
        })
      }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptorSuccessFn: null as any,
    interceptorErrorFn: null as any
  };
  return mockAxios;
});

const mockAxios = axios as jest.Mocked<typeof axios> & { 
  interceptorSuccessFn: any;
  interceptorErrorFn: any;
  create: jest.Mock;
};

describe('ApiManager', () => {
  let apiManager: ApiManager;
  
  beforeEach(() => {
    jest.clearAllMocks();
    apiManager = new ApiManager('https://api.example.com', {
      headers: { 'X-API-Key': 'test-key' },
      timeout: 5000
    });
  });

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
        headers: { 'X-API-Key': 'test-key' },
        timeout: 5000
      });
    });

    it('should use default timeout when not provided', () => {
      new ApiManager('https://api.example.com');
      expect(mockAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 30000
        })
      );
    });
  });

  describe('HTTP methods', () => {
    it('should make GET request with correct parameters', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: { result: 'success' } });
      
      const result = await apiManager.get('/endpoint', { param: 'value' });
      
      expect(mockAxios.get).toHaveBeenCalledWith('/endpoint', {
        params: { param: 'value' }
      });
      expect(result).toEqual({ result: 'success' });
    });

    it('should make POST request with correct data', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: { id: '123' } });
      
      const result = await apiManager.post('/endpoint', { name: 'test' });
      
      expect(mockAxios.post).toHaveBeenCalledWith('/endpoint', { name: 'test' }, undefined);
      expect(result).toEqual({ id: '123' });
    });

    it('should make PUT request with correct data', async () => {
      mockAxios.put.mockResolvedValueOnce({ data: { updated: true } });
      
      const result = await apiManager.put('/endpoint', { id: '123', name: 'updated' });
      
      expect(mockAxios.put).toHaveBeenCalledWith('/endpoint', { id: '123', name: 'updated' }, undefined);
      expect(result).toEqual({ updated: true });
    });

    it('should make DELETE request with correct url', async () => {
      mockAxios.delete.mockResolvedValueOnce({ data: { deleted: true } });
      
      const result = await apiManager.delete('/endpoint/123');
      
      expect(mockAxios.delete).toHaveBeenCalledWith('/endpoint/123', undefined);
      expect(result).toEqual({ deleted: true });
    });
  });

  describe('Error handling', () => {
    it('should transform network errors correctly', () => {
      // Get the error handler that was registered with axios
      const errorHandler = mockAxios.interceptorErrorFn;
      expect(errorHandler).toBeDefined();
      
      // Create a mock axios error with a response
      const axiosError = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: { message: 'Something went wrong' }
        },
        isAxiosError: true
      } as unknown as AxiosError;
      
      // This should throw a NetworkError
      try {
        errorHandler(axiosError);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NetworkError);
        expect((error as NetworkError).status).toBe(500);
        expect((error as NetworkError).statusText).toBe('Internal Server Error');
        expect((error as NetworkError).data).toEqual({ message: 'Something went wrong' });
      }
    });
    
    it('should transform authentication errors correctly', () => {
      const errorHandler = mockAxios.interceptorErrorFn;
      
      // Create a mock axios error for authentication failure
      const axiosError = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid API key' }
        },
        isAxiosError: true
      } as unknown as AxiosError;
      
      try {
        errorHandler(axiosError);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AuthenticationError);
        expect((error as AuthenticationError).message).toBe('Invalid API key');
      }
    });
    
    it('should transform rate limit errors correctly', () => {
      const errorHandler = mockAxios.interceptorErrorFn;
      
      // Create a mock axios error for rate limiting
      const axiosError = {
        response: {
          status: 429,
          statusText: 'Too Many Requests',
          data: { message: 'Rate limit exceeded' },
          headers: {
            'retry-after': '30'
          }
        },
        isAxiosError: true
      } as unknown as AxiosError;
      
      try {
        errorHandler(axiosError);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        expect((error as RateLimitError).message).toBe('Rate limit exceeded');
        expect((error as RateLimitError).retryAfter).toBe(30);
      }
    });
    
    it('should handle request errors without response', () => {
      const errorHandler = mockAxios.interceptorErrorFn;
      
      // Create a mock axios error without a response
      const axiosError = {
        request: {},
        message: 'Network Error',
        isAxiosError: true
      } as unknown as AxiosError;
      
      try {
        errorHandler(axiosError);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NetworkError);
        expect((error as NetworkError).status).toBe(0);
        expect((error as NetworkError).statusText).toBe('No response received');
      }
    });
    
    it('should handle other errors', () => {
      const errorHandler = mockAxios.interceptorErrorFn;
      
      // Create a generic error
      const genericError = new Error('Something went wrong');
      
      try {
        errorHandler(genericError);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Something went wrong');
      }
    });
  });

  describe('Error inheritance', () => {
    it('should properly set up inheritance for custom errors', () => {
      // Create instances of each error type
      const apiError = new ApiError('Generic API error');
      const networkError = new NetworkError(404, 'Not Found');
      const authError = new AuthenticationError('Auth failed');
      const rateLimitError = new RateLimitError('Too many requests', 30);

      // Test instanceof relationships
      expect(apiError instanceof Error).toBe(true);
      expect(apiError instanceof ApiError).toBe(true);

      expect(networkError instanceof Error).toBe(true);
      expect(networkError instanceof ApiError).toBe(true);
      expect(networkError instanceof NetworkError).toBe(true);

      expect(authError instanceof Error).toBe(true);
      expect(authError instanceof ApiError).toBe(true);
      expect(authError instanceof AuthenticationError).toBe(true);

      expect(rateLimitError instanceof Error).toBe(true);
      expect(rateLimitError instanceof ApiError).toBe(true);
      expect(rateLimitError instanceof RateLimitError).toBe(true);

      // Test that cross-inheritance doesn't happen
      expect(networkError instanceof AuthenticationError).toBe(false);
      expect(authError instanceof NetworkError).toBe(false);
    });
  });
});

// Helper function for Jest
function fail(message: string): never {
  throw new Error(message);
}