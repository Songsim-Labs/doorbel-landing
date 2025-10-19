import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { config } from './config';
import { LoginRequest, LoginResponse, ApiResponse, AdminUser } from '@/types/admin';
import { Rider, KYC, RiderFilters, RiderStats, KYCStatus } from '@/types/rider';
import { Order, OrderFilters, OrderStats } from '@/types/order';
import { Transaction, PaymentStats, PaymentFilters } from '@/types/payment';
import { DashboardStats } from '@/types/stats';
import { Ticket, TicketFilters, TicketDetails, CannedResponse, SupportStats } from '@/types/support';

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: `${config.apiUrl}/api/${config.apiVersion}`,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('adminAccessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try refresh or logout
          Cookies.remove('adminAccessToken');
          Cookies.remove('adminRefreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
  
  // ===== AUTHENTICATION =====
  
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/admin/login', credentials);
    return response.data;
  }
  
  async getProfile(): Promise<ApiResponse<AdminUser>> {
    const response = await this.client.get<ApiResponse<AdminUser>>('/auth/me');
    return response.data;
  }
  
  // ===== DASHBOARD STATS =====
  // Note: Dashboard stats aggregation is now handled by React Query hooks
  // Individual stat methods below are used by the query hooks
  
  // ===== ORDERS =====
  
  async getOrders(filters?: OrderFilters, page = 1, limit = 20): Promise<{ orders: Order[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.status?.length) params.append('status', filters.status.join(','));
    if (filters?.deliveryType?.length) params.append('deliveryType', filters.deliveryType.join(','));
    if (filters?.paymentStatus?.length) params.append('paymentStatus', filters.paymentStatus.join(','));
    if (filters?.paymentMethod?.length) params.append('paymentMethod', filters.paymentMethod.join(','));
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await this.client.get<ApiResponse<{ orders: Order[]; pagination: { page: number; limit: number; total: number; pages: number } }>>(`/admin/orders?${params.toString()}`);
    return response.data.data;
  }
  
  async getOrderById(orderId: string): Promise<Order> {
    const response = await this.client.get<ApiResponse<Order>>(`/order/${orderId}`);
    return response.data.data;
  }
  
  async getOrderStats(): Promise<OrderStats> {
    const response = await this.client.get<ApiResponse<OrderStats>>('/admin/dashboard/order-stats');
    return response.data.data;
  }
  
  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    const response = await this.client.delete<ApiResponse<Order>>(`/order/${orderId}`, {
      data: { reason },
    });
    return response.data.data;
  }
  
  // ===== RIDERS =====
  
  async getRiders(filters?: RiderFilters, page = 1, limit = 20): Promise<{ riders: Rider[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.vehicleType) params.append('vehicleType', filters.vehicleType);
    if (filters?.isAvailable !== undefined) params.append('isAvailable', filters.isAvailable.toString());
    if (filters?.kycStatus) params.append('kycStatus', filters.kycStatus);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await this.client.get<ApiResponse<{ riders: Rider[]; pagination: { page: number; limit: number; total: number; pages: number } }>>(`/admin/riders?${params.toString()}`);
    return response.data.data;
  }
  
  async getRiderById(riderId: string): Promise<Rider> {
    const response = await this.client.get<ApiResponse<Rider>>(`/rider/${riderId}`);
    return response.data.data;
  }
  
  async getRiderStats(): Promise<RiderStats> {
    const response = await this.client.get<ApiResponse<RiderStats>>('/admin/dashboard/rider-stats');
    return response.data.data;
  }
  
  // ===== KYC =====
  
  async getAllKYC(page = 1, limit = 20, status?: KYCStatus): Promise<{ kyc: KYC[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    
    const response = await this.client.get<ApiResponse<{ kyc: KYC[]; total: number; totalPages: number; page: number; hasMorePages: boolean }>>(`/admin/kyc?${params.toString()}`);
    const data = response.data.data;
    return {
      kyc: data?.kyc || [],
      pagination: {
        total: data?.total || 0,
        page: data?.page || page,
        limit,
        pages: data?.totalPages || 1,
      },
    };
  }
  
  async getKYCById(kycId: string): Promise<KYC> {
    const response = await this.client.get<ApiResponse<KYC>>(`/kyc/${kycId}`);
    return response.data.data;
  }
  
  async approveKYC(kycId: string): Promise<KYC> {
    const response = await this.client.patch<ApiResponse<KYC>>(`/kyc/${kycId}/approve`);
    return response.data.data;
  }
  
  async rejectKYC(kycId: string, reason: string): Promise<KYC> {
    const response = await this.client.patch<ApiResponse<KYC>>(`/kyc/${kycId}/reject`, { reason });
    return response.data.data;
  }
  
  async getKYCStats(): Promise<{ pending: number; approved: number; rejected: number }> {
    const response = await this.client.get<ApiResponse<{ pending: number; approved: number; rejected: number }>>('/admin/dashboard/kyc-stats');
    return response.data.data;
  }
  
  // ===== PAYMENTS =====
  
  async getPayments(filters?: PaymentFilters, page = 1, limit = 20): Promise<{ payments: Transaction[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.status?.length) params.append('status', filters.status.join(','));
    if (filters?.type?.length) params.append('type', filters.type.join(','));
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await this.client.get<ApiResponse<{ payments: Transaction[]; pagination: { page: number; limit: number; total: number; pages: number } }>>(`/admin/payments?${params.toString()}`);
    // The backend returns { payments: [], pagination: {} } inside data
    return response.data.data || { payments: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }
  
  async getPaymentStats(): Promise<PaymentStats> {
    const response = await this.client.get<ApiResponse<PaymentStats>>('/admin/dashboard/payment-stats');
    return response.data.data;
  }
  
  async getPaymentById(paymentId: string): Promise<Transaction> {
    const response = await this.client.get<ApiResponse<Transaction>>(`/payments/${paymentId}`);
    return response.data.data;
  }
  
  // ===== ANALYTICS =====
  
  async getAnalytics(period: 'today' | 'week' | 'month' | 'year' = 'week'): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(`/admin/analytics?period=${period}`);
    return response.data.data;
  }
  
  async getRevenueAnalytics(period: 'today' | 'week' | 'month' | 'year' = 'week'): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(`/admin/analytics/revenue?period=${period}`);
    return response.data.data;
  }
  
  async getRiderAnalytics(): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>('/admin/analytics/riders');
    return response.data.data;
  }
  
  async getCustomerAnalytics(): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>('/admin/analytics/customers');
    return response.data.data;
  }
  
  // ===== ACTIVITY LOGS =====
  
  async getActivityLogs(filters?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<{ activities: any[]; pagination: { page: number; limit: number; totalCount: number; totalPages: number; hasMore: boolean } }> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await this.client.get<ApiResponse<{ activities: any[]; pagination: any }>>(`/admin/dashboard/activity?${params.toString()}`);
    return response.data.data;
  }
  
  async exportActivityLogs(filters?: {
    type?: string;
    status?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);
    params.append('limit', '10000'); // Get all records for export
    
    const response = await this.client.get(`/admin/dashboard/activity?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }
  
  // ===== ADMIN MANAGEMENT =====
  
  async getAllAdmins(): Promise<AdminUser[]> {
    const response = await this.client.get<ApiResponse<AdminUser[]>>('/admin/users');
    return response.data.data;
  }
  
  async addAdmin(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AdminUser> {
    const response = await this.client.post<ApiResponse<AdminUser>>('/admin/add', data);
    return response.data.data;
  }
  
  async deleteAdmin(adminId: string): Promise<void> {
    await this.client.delete(`/admin/users/${adminId}`);
  }
  
  async getAdminById(adminId: string): Promise<AdminUser> {
    const response = await this.client.get<ApiResponse<AdminUser>>(`/admin/users/${adminId}`);
    return response.data.data;
  }
  
  // ===== NOTIFICATIONS =====
  
  async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString(),
    });
    
    const response = await this.client.get<ApiResponse<any>>(`/notifications?${params}`);
    return response.data.data;
  }
  
  async getUnreadNotificationCount(): Promise<number> {
    const response = await this.client.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data.data.count;
  }
  
  async markNotificationAsRead(notificationId: string): Promise<any> {
    const response = await this.client.patch<ApiResponse<any>>(`/notifications/${notificationId}/read`);
    return response.data.data;
  }
  
  async markAllNotificationsAsRead(): Promise<void> {
    await this.client.patch('/notifications/mark-all-read');
  }
  
  async getNotificationPreferences(): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>('/notifications/preferences');
    return response.data.data;
  }
  
  async updateNotificationPreferences(preferences: any): Promise<any> {
    const response = await this.client.patch<ApiResponse<any>>('/notifications/preferences', { preferences });
    return response.data.data;
  }
  
  async updatePushToken(pushToken: string): Promise<void> {
    await this.client.post('/notifications/push-token', { pushToken });
  }
  
  // ===== SERVER CONFIGURATION =====
  
  async getServerConfigs(): Promise<any[]> {
    const response = await this.client.get<ApiResponse<any[]>>('/config');
    return response.data.data;
  }
  
  async getServerConfigsByCategory(category: string): Promise<any[]> {
    const response = await this.client.get<ApiResponse<any[]>>(`/config/category/${category}`);
    return response.data.data;
  }
  
  async getServerConfig(key: string): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(`/config/${key}`);
    return response.data.data;
  }
  
  async updateServerConfig(key: string, value: any, category: string, description?: string): Promise<any> {
    const response = await this.client.put<ApiResponse<any>>('/config', {
      key,
      value,
      category,
      description,
    });
    return response.data.data;
  }
  
  async deleteServerConfig(key: string): Promise<void> {
    await this.client.delete(`/config/${key}`);
  }
  
  async getConfigCategories(): Promise<string[]> {
    const response = await this.client.get<ApiResponse<string[]>>('/config/categories/list');
    return response.data.data;
  }
  
  async clearConfigCache(): Promise<void> {
    await this.client.post('/config/cache/clear');
  }
  
  async importConfigsFromEnv(): Promise<{ success: number; failed: number }> {
    const response = await this.client.post<ApiResponse<{ success: number; failed: number }>>('/config/import');
    return response.data.data;
  }
  
  // ===== SUPPORT TICKETS =====
  
  async getSupportTickets(filters?: TicketFilters, page = 1, limit = 20): Promise<{ tickets: Ticket[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.status?.length) params.append('status', filters.status.join(','));
    if (filters?.priority?.length) params.append('priority', filters.priority.join(','));
    if (filters?.category?.length) params.append('category', filters.category.join(','));
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters?.userType) params.append('userType', filters.userType);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await this.client.get<ApiResponse<{ tickets: Ticket[]; total: number; totalPages: number; page: number; hasMorePages: boolean }>>(`/support/admin/tickets?${params.toString()}`);
    const data = response.data.data;
    return {
      tickets: data?.tickets || [],
      pagination: {
        total: data?.total || 0,
        page: data?.page || page,
        limit,
        pages: data?.totalPages || 1,
      },
    };
  }
  
  async getTicketById(ticketId: string): Promise<TicketDetails> {
    const response = await this.client.get<ApiResponse<TicketDetails>>(`/support/tickets/${ticketId}`);
    return response.data.data;
  }
  
  async assignTicket(ticketId: string, adminId: string): Promise<Ticket> {
    const response = await this.client.patch<ApiResponse<Ticket>>(`/support/admin/tickets/${ticketId}/assign`, { adminId });
    return response.data.data;
  }
  
  async updateTicketPriority(ticketId: string, priority: string): Promise<Ticket> {
    const response = await this.client.patch<ApiResponse<Ticket>>(`/support/admin/tickets/${ticketId}/priority`, { priority });
    return response.data.data;
  }
  
  async updateTicketStatus(ticketId: string, status: string): Promise<Ticket> {
    const response = await this.client.patch<ApiResponse<Ticket>>(`/support/admin/tickets/${ticketId}/status`, { status });
    return response.data.data;
  }
  
  async respondToTicket(ticketId: string, message: string, attachments?: any[], isInternal = false, cannedResponseId?: string): Promise<any> {
    const response = await this.client.post<ApiResponse<any>>(`/support/admin/tickets/${ticketId}/respond`, {
      message,
      attachments,
      isInternal,
      cannedResponseId,
    });
    return response.data.data;
  }
  
  async getSupportStats(): Promise<SupportStats> {
    const response = await this.client.get<ApiResponse<SupportStats>>('/support/admin/stats');
    return response.data.data;
  }
  
  // ===== CANNED RESPONSES =====
  
  async getCannedResponses(category?: string): Promise<CannedResponse[]> {
    const params = category ? `?category=${category}` : '';
    const response = await this.client.get<ApiResponse<CannedResponse[]>>(`/support/admin/canned-responses${params}`);
    return response.data.data;
  }
  
  async createCannedResponse(data: { title: string; content: string; category: string; shortcut: string }): Promise<CannedResponse> {
    const response = await this.client.post<ApiResponse<CannedResponse>>('/support/admin/canned-responses', data);
    return response.data.data;
  }
  
  async updateCannedResponse(responseId: string, data: Partial<CannedResponse>): Promise<CannedResponse> {
    const response = await this.client.patch<ApiResponse<CannedResponse>>(`/support/admin/canned-responses/${responseId}`, data);
    return response.data.data;
  }
  
  async deleteCannedResponse(responseId: string): Promise<void> {
    await this.client.delete(`/support/admin/canned-responses/${responseId}`);
  }

  // ===== FAILED TRANSACTIONS =====
  
  async getFailedTransactions(type?: 'order' | 'transfer', page = 1, limit = 20, dateFrom?: string, dateTo?: string): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (type) params.append('type', type);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const response = await this.client.get(`/payments/failed?${params.toString()}`);
    return response.data;
  }
  
  async getFailedTransactionDetails(transactionId: string): Promise<any> {
    const response = await this.client.get(`/payments/failed/${transactionId}`);
    return response.data;
  }
  
  async retryFailedPayout(transactionId: string): Promise<any> {
    const response = await this.client.post(`/payments/failed/${transactionId}/retry`);
    return response.data;
  }
}

export const apiClient = new ApiClient();

