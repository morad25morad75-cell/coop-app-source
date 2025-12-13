
export interface UserProfile {
  fullName: string;
  companyName: string;
  projectType: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  password?: string; // For authentication
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

export interface Sale {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  date: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'service' | 'purchase';
  date: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  notes: string;
  participants: string;
}

export interface Member {
  id: string;
  name: string;
  role: string; // 'partner' or 'employee'
  sharePercentage?: number; // Only for partners
  phone: string;
}

export type NotificationType = {
  id: string;
  message: string;
  read: boolean;
  date: string;
};

export enum AppLanguage {
  AR = 'ar',
  EN = 'en'
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}