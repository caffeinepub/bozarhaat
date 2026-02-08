import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: number;
    sku?: string;
    categoryId?: string;
    shippingCharge?: bigint;
    name: string;
    description: string;
    fulfillmentType: string;
    sellerId?: string;
    inventoryCount: bigint;
    price: bigint;
    taxRate?: bigint;
}
export interface Category {
    id: string;
    name: string;
    description: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getCategory(categoryId: string): Promise<Category | null>;
    getProduct(productId: number): Promise<Product | null>;
    isCallerAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<Category>>;
    listProductIdsByCategory(categoryId: string): Promise<Uint32Array>;
    listProducts(): Promise<Array<Product>>;
    listProductsByCategory(categoryId: string): Promise<Array<Product>>;
}
