
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  phone?: string;
  city?: string;
  joinDate?: string;
  avatar?: string;
  department?: string;
  year?: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  image: string;
  available: boolean;
  stock: number;
  category: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  REJECTED = 'REJECTED'
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: HardwareItem[];
  totalAmount: number;
  status: OrderStatus;
  date: string;
  address: string;
  collegeId: string;
  contact: string;
}

export interface Reply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title?: string; // Optional
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  replies: Reply[]; // Changed from number to Reply[]
  reposts: number;
  isVerified?: boolean;
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  deadline: string;
}
