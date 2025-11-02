import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Base API client using Axios
export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(
          `Making ${config.method?.toUpperCase()} request to: ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        console.error("Response error:", error.response?.data || error.message);

        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const message =
            error.response.data?.message ||
            `HTTP ${error.response.status}: ${error.response.statusText}`;
          throw new Error(message);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error("Network error: No response from server");
        } else {
          // Something else happened
          throw new Error(error.message || "An unexpected error occurred");
        }
      }
    );
  }

  async request<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        url: endpoint,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "POST", data });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "PUT", data });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", data });
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient();
