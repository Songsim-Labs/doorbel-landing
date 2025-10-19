export type VehicleType = 'car' | 'motorcycle' | 'bicycle' | 'truck';
export type RiderStatus = 'online' | 'offline' | 'busy' | 'unavailable';
export type KYCStatus = 'pending' | 'approved' | 'rejected';
export type MobileMoneyProvider = 'ATL' | 'MTN' | 'VOD';

export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IMedia {
  url: string;
  public_id: string;
}

export interface Rider {
  _id: string;
  auth: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: {
      url: string;
      public_id: string;
    };
  };
  contactPhone: string;
  contactEmail: string;
  currentLocation: ILocation;
  lastLocationUpdate?: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  licenseNumber?: string;
  isActive: boolean;
  isAvailable: boolean;
  orderCount: number;
  successfulOrderCount: number;
  kycStatus: KYCStatus;
  rating: number;
  totalRatings: number;
  status: RiderStatus;
  feedbackCount: number;
  payoutAccount?: {
    accountName: string;
    mobileMoneyProvider: MobileMoneyProvider;
    accountNumber: string;
    recipientCode?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KYC {
  _id: string;
  rider: string | Rider;
  idCardFront: IMedia;
  idCardBack: IMedia;
  idNumber: string;
  selfie: IMedia;
  licensePlateImage: IMedia;
  licensePlateNumber: string;
  status: KYCStatus;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiderFilters {
  status?: RiderStatus;
  vehicleType?: VehicleType;
  isAvailable?: boolean;
  kycStatus?: KYCStatus;
  search?: string;
}

export interface RiderStats {
  totalRiders: number;
  activeRiders: number;
  availableRiders: number;
  busyRiders: number;
  offlineRiders: number;
  pendingKYC: number;
  approvedKYC: number;
  rejectedKYC: number;
}

