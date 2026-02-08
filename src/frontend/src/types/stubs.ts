// Stub type definitions for missing backend types
// These are temporary placeholders until the backend implements these features

export enum UserType {
  buyer = 'buyer',
  seller = 'seller',
  deliveryPartner = 'deliveryPartner',
}

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  shippingAddress?: string;
  userType: UserType;
}

export interface BuyerProfile {
  shippingAddress: string;
  paymentMethod?: string;
  billingAddress?: string;
}

export interface SellerProfile {
  businessName: string;
  gstNumber?: string;
}

export interface DeliveryPartnerProfile {
  name: string;
  contactDetails: string;
  canServeOtherEcommerce: boolean;
  servicePricePaise: number;
}

export interface CartItem {
  product: {
    id: number;
    name: string;
    description: string;
    price: bigint;
    inventoryCount: bigint;
    categoryId?: string;
    fulfillmentType: string;
    sellerId?: string;
    taxRate?: bigint;
    shippingCharge?: bigint;
    sku?: string;
  };
  quantity: bigint;
}

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export interface Order {
  id: number;
  userId: string;
  products: Array<{
    id: number;
    name: string;
    description: string;
    price: bigint;
    inventoryCount: bigint;
    categoryId?: string;
    fulfillmentType: string;
    sellerId?: string;
    taxRate?: bigint;
    shippingCharge?: bigint;
    sku?: string;
  }>;
  quantities: bigint[];
  totalPrice: bigint;
  status: OrderStatus;
  createdAt: number;
  ondcOrderId?: string;
  fulfillmentStatus?: string;
  paymentStatus?: string;
  itemPriceBreakdown?: bigint;
  taxAmount?: bigint;
  deliveryCharge?: bigint;
  shippingAddress?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolderName: string;
}
