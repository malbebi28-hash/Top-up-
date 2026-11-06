export interface DiamondPack {
  id: number;
  name: string;
  diamonds: number | string;
  originalPrice: number;
  category: 'diamonds' | 'membership' | 'special';
  badge?: string;
  popular?: boolean;
}

export interface PlacedOrder {
  orderId: string;
  uid: string;
  packName: string;
  originalPrice: number;
  discount: number;
  finalPrice: string;
  utrNumber: string;
  timestamp: number;
  status: 'pending' | 'completed';
}

export type Language = 'bn' | 'en';
