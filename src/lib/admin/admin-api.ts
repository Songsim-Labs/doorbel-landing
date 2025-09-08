// Admin API service for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doorbel-api.onrender.com';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AdminAuthResponse {
  admin: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: string;
    isVerified: boolean;
    isActive: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    tokenFamily: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
  };
}

interface DashboardStats {
  total: number;
  confirmed: number;
  launched: number;
  marketingOptIn: number;
  byCity: string[];
  byRole: string[];
  byStatus: string[];
}

interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
}

interface RiderStats {
  totalRiders: number;
  activeRiders: number;
  pendingRiders: number;
  averageRating: number;
  totalDeliveries: number;
  averageDeliveryTime: number;
}

interface PaymentStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalAmount: number;
  averageTransactionValue: number;
  successRate: number;
}

class AdminApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/v1`;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(identifier: string, password: string): Promise<AdminAuthResponse> {
    const response = await this.request<AdminAuthResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });

    // Store token for future requests
    if (response.data.tokens.accessToken) {
      this.token = response.data.tokens.accessToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', response.data.tokens.accessToken);
        localStorage.setItem('adminRefreshToken', response.data.tokens.refreshToken);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      }
    }

    return response.data;
  }

  async logout(): Promise<void> {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminUser');
    }
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.request<DashboardStats>('/admin/dashboard/stats');
    return response.data;
  }

  async getOrderStats(): Promise<OrderStats> {
    const response = await this.request<OrderStats>('/admin/dashboard/order-stats');
    return response.data;
  }

  async getRiderStats(): Promise<RiderStats> {
    const response = await this.request<RiderStats>('/admin/dashboard/rider-stats');
    return response.data;
  }

  async getPaymentStats(): Promise<PaymentStats> {
    const response = await this.request<PaymentStats>('/admin/dashboard/payment-stats');
    return response.data;
  }

  // Waitlist Management
  async getWaitlistUsers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    role?: string;
    city?: string;
    search?: string;
  }): Promise<{
    users: unknown[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await this.request<{ users: unknown[]; total: number; page: number; totalPages: number }>(`/admin/waitlist?${queryParams}`);
    return response.data;
  }

  async updateWaitlistUser(userId: string, updates: Record<string, unknown>): Promise<unknown> {
    const response = await this.request<unknown>(`/admin/waitlist/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteWaitlistUser(userId: string): Promise<void> {
    await this.request<void>(`/admin/waitlist/${userId}`, {
      method: 'DELETE',
    });
  }

  // Campaign Management
  async getCampaigns(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }): Promise<{
    campaigns: unknown[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await this.request<{ campaigns: unknown[]; total: number; page: number; totalPages: number }>(`/admin/campaigns?${queryParams}`);
    return response.data;
  }

  async createCampaign(campaignData: Record<string, unknown>): Promise<unknown> {
    const response = await this.request<unknown>('/admin/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
    return response.data;
  }

  async updateCampaign(campaignId: string, updates: Record<string, unknown>): Promise<unknown> {
    const response = await this.request<unknown>(`/admin/campaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteCampaign(campaignId: string): Promise<void> {
    await this.request<void>(`/admin/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
  }

  async sendCampaign(campaignId: string): Promise<unknown> {
    const response = await this.request<unknown>(`/admin/campaigns/${campaignId}/send`, {
      method: 'POST',
    });
    return response.data;
  }

  // Order Management
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    orders: unknown[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await this.request<{ orders: unknown[]; total: number; page: number; totalPages: number }>(`/admin/orders?${queryParams}`);
    return response.data;
  }

  async getOrder(orderId: string): Promise<unknown> {
    const response = await this.request<unknown>(`/admin/orders/${orderId}`);
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<unknown> {
    const response = await this.request<unknown>(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  }

  // Rider Management
  async getRiders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    city?: string;
  }): Promise<{
    riders: unknown[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await this.request<{ riders: unknown[]; total: number; page: number; totalPages: number }>(`/admin/riders?${queryParams}`);
    return response.data;
  }

  async getRider(riderId: string): Promise<unknown> {
    const response = await this.request<unknown>(`/admin/riders/${riderId}`);
    return response.data;
  }

  async updateRiderStatus(riderId: string, status: string): Promise<unknown> {
    const response = await this.request<unknown>(`/admin/riders/${riderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  }

  // KYC Management
  async getKYCApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    applications: unknown[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await this.request<{ applications: unknown[]; total: number; page: number; totalPages: number }>(`/admin/kyc?${queryParams}`);
    return response.data;
  }

  async updateKYCStatus(applicationId: string, status: string, notes?: string): Promise<unknown> {
    const response = await this.request<unknown>(`/admin/kyc/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
    return response.data;
  }

  // Payment Management
  async getPayments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    payments: unknown[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await this.request<{ payments: unknown[]; total: number; page: number; totalPages: number }>(`/admin/payments?${queryParams}`);
    return response.data;
  }

  async getPayment(paymentId: string): Promise<unknown> {
    const response = await this.request<unknown>(`/admin/payments/${paymentId}`);
    return response.data;
  }

  // Analytics
  async getAnalytics(params?: {
    period?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<unknown> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await this.request<unknown>(`/admin/analytics?${queryParams}`);
    return response.data;
  }

  // Utility methods
  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Export singleton instance
export const adminApi = new AdminApiService();
export default adminApi;
