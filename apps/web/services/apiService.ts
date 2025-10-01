// services/apiService.ts

import { handleApiError, logError, StroompError } from '../utils/errorHandler';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface StreamData {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'LIVE' | 'ENDED' | 'UPCOMING';
  streamer: {
    id: string;
    walletAddress: string;
    username: string;
    profileImageUrl?: string;
  };
  viewers: number;
  startTime: string; // ISO date string
}

export interface DonationData {
  id: string;
  from: string;
  to: string;
  amount: number;
  message?: string;
  txSignature: string;
  timestamp: string; // ISO date string
}

export interface SubscriptionData {
  id: string;
  userId: string;
  streamerId: string;
  tierId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
}

class ApiService {
  private baseUrl: string;
  private headers: Headers;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    this.headers = new Headers({
      'Content-Type': 'application/json',
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || `API request failed: ${response.status}`;
        throw new StroompError(errorMessage, `HTTP_${response.status}`);
      }

      // Validate response structure
      if (typeof data !== 'object' || data === null) {
        throw new StroompError('Invalid response format received from API', 'INVALID_RESPONSE_FORMAT');
      }

      if (typeof data.success !== 'boolean') {
        throw new StroompError('API response missing success flag', 'INVALID_RESPONSE_FORMAT');
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new StroompError('Network error. Please check your connection.', 'NETWORK_ERROR');
      }

      // Handle other errors with our error handler
      const processedError = handleApiError(error);
      logError(processedError, `API Request: ${url}`);
      throw processedError;
    }
  }

  // Stream-related API methods
  async getStreams(): Promise<ApiResponse<StreamData[]>> {
    return this.request<StreamData[]>('/api/streams');
  }

  async getStreamById(id: string): Promise<ApiResponse<StreamData>> {
    if (!id) {
      throw new StroompError('Stream ID is required', 'MISSING_PARAMETER');
    }
    return this.request<StreamData>(`/api/streams/${id}`);
  }

  async createStream(streamData: Omit<StreamData, 'id' | 'status' | 'viewers' | 'startTime'>): Promise<ApiResponse<StreamData>> {
    if (!streamData.title || !streamData.category) {
      throw new StroompError('Title and category are required', 'MISSING_PARAMETER');
    }
    
    return this.request<StreamData>('/api/streams', {
      method: 'POST',
      body: JSON.stringify(streamData),
    });
  }

  async getLiveStreams(): Promise<ApiResponse<StreamData[]>> {
    return this.request<StreamData[]>('/api/streams/live');
  }

  // Donation-related API methods
  async getDonations(streamId: string): Promise<ApiResponse<DonationData[]>> {
    if (!streamId) {
      throw new StroompError('Stream ID is required', 'MISSING_PARAMETER');
    }
    return this.request<DonationData[]>(`/api/donations?streamId=${streamId}`);
  }

  async createDonation(donationData: Omit<DonationData, 'id' | 'timestamp'>): Promise<ApiResponse<DonationData>> {
    if (!donationData.from || !donationData.to || donationData.amount <= 0) {
      throw new StroompError('Valid from, to, and amount are required', 'MISSING_PARAMETER');
    }
    
    return this.request<DonationData>('/api/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  // Subscription-related API methods
  async getUserSubscriptions(userId: string): Promise<ApiResponse<SubscriptionData[]>> {
    if (!userId) {
      throw new StroompError('User ID is required', 'MISSING_PARAMETER');
    }
    return this.request<SubscriptionData[]>(`/api/subscriptions?userId=${userId}`);
  }

  async createSubscription(subscriptionData: Omit<SubscriptionData, 'id' | 'isActive'>): Promise<ApiResponse<SubscriptionData>> {
    if (!subscriptionData.userId || !subscriptionData.streamerId || !subscriptionData.tierId) {
      throw new StroompError('User ID, streamer ID, and tier ID are required', 'MISSING_PARAMETER');
    }
    
    return this.request<SubscriptionData>('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  }

  async getStreamerSubscribers(streamerId: string): Promise<ApiResponse<SubscriptionData[]>> {
    if (!streamerId) {
      throw new StroompError('Streamer ID is required', 'MISSING_PARAMETER');
    }
    return this.request<SubscriptionData[]>(`/api/subscriptions/streamer/${streamerId}`);
  }

  // User-related API methods
  async getUserByWallet(walletAddress: string): Promise<ApiResponse<any>> {
    if (!walletAddress) {
      throw new StroompError('Wallet address is required', 'MISSING_PARAMETER');
    }
    return this.request<any>(`/api/users/wallet/${walletAddress}`);
  }

  async createUser(userData: { walletAddress: string; username: string }): Promise<ApiResponse<any>> {
    if (!userData.walletAddress || !userData.username) {
      throw new StroompError('Wallet address and username are required', 'MISSING_PARAMETER');
    }
    
    return this.request<any>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Poll-related API methods
  async createPoll(pollData: { question: string; options: string[]; streamId: string }): Promise<ApiResponse<any>> {
    if (!pollData.question || !pollData.streamId || !Array.isArray(pollData.options) || pollData.options.length === 0) {
      throw new StroompError('Question, stream ID, and options are required', 'MISSING_PARAMETER');
    }
    
    return this.request<any>('/api/polls', {
      method: 'POST',
      body: JSON.stringify(pollData),
    });
  }

  async voteInPoll(pollId: string, optionId: string): Promise<ApiResponse<any>> {
    if (!pollId || !optionId) {
      throw new StroompError('Poll ID and option ID are required', 'MISSING_PARAMETER');
    }
    
    return this.request<any>(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    });
  }

  // Raid-related API methods
  async initiateRaid(raidData: { fromStreamerId: string; toStreamerId: string; message: string }): Promise<ApiResponse<any>> {
    if (!raidData.fromStreamerId || !raidData.toStreamerId) {
      throw new StroompError('From streamer ID and to streamer ID are required', 'MISSING_PARAMETER');
    }
    
    return this.request<any>('/api/raids', {
      method: 'POST',
      body: JSON.stringify(raidData),
    });
  }
}

export const apiService = new ApiService();