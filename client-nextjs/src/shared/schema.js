
import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { z } from 'zod'

// Database tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  role: text("role").notNull(), // admin, manager, employee
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  grade: text("grade").notNull(), // A, B, C, VIP
  industry: text("industry"),
  assignedUserId: integer("assigned_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  stock: integer("stock").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const salesOpportunities = pgTable("sales_opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  assignedUserId: integer("assigned_user_id").references(() => users.id),
  expectedAmount: decimal("expected_amount", { precision: 12, scale: 2 }),
  expectedCloseDate: timestamp("expected_close_date"),
  stage: text("stage").notNull(), // lead, qualified, proposal, negotiation, closed_won, closed_lost
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

export const registerSchema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  username: z.string().min(2, "사용자명은 최소 2자 이상이어야 합니다"),
  department: z.string().min(1, "부서를 선택해주세요"),
  role: z.string().min(1, "역할을 선택해주세요"),
});

export const customerSchema = z.object({
  companyName: z.string().min(1, "회사명을 입력해주세요"),
  contactName: z.string().min(1, "담당자명을 입력해주세요"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  grade: z.enum(['A', 'B', 'C', 'VIP']),
  industry: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "제품명을 입력해주세요"),
  code: z.string().min(1, "제품 코드를 입력해주세요"),
  category: z.string().min(1, "카테고리를 입력해주세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  description: z.string().optional(),
  stock: z.number().min(0).default(0),
});

// TypeScript types for inference (will be used in TypeScript files)
export const User = null; // Placeholder for JS compatibility
export const Customer = null; // Placeholder for JS compatibility  
export const Product = null; // Placeholder for JS compatibility
export const SalesOpportunity = null; // Placeholder for JS compatibility
