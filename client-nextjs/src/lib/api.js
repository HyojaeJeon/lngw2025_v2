import { db } from './database.js';
import { users, customers, products, salesOpportunities } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth functions
export async function authenticateUser(email, password) {
  try {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user.length === 0) {
      return null;
    }
    
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    
    if (!isValidPassword) {
      return null;
    }
    
    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      token,
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        name: user[0].name,
        department: user[0].department,
        role: user[0].role
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function registerUser(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = await db.insert(users).values({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      department: userData.department,
      role: userData.role || 'employee'
    }).returning();
    
    return newUser[0];
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Customer functions
export async function getCustomers() {
  try {
    return await db.select().from(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    throw error;
  }
}

export async function createCustomer(customerData) {
  try {
    const newCustomer = await db.insert(customers).values(customerData).returning();
    return newCustomer[0];
  } catch (error) {
    console.error('Create customer error:', error);
    throw error;
  }
}

export async function updateCustomer(id, customerData) {
  try {
    const updatedCustomer = await db.update(customers)
      .set(customerData)
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer[0];
  } catch (error) {
    console.error('Update customer error:', error);
    throw error;
  }
}

export async function deleteCustomer(id) {
  try {
    await db.delete(customers).where(eq(customers.id, id));
    return true;
  } catch (error) {
    console.error('Delete customer error:', error);
    throw error;
  }
}

// Product functions
export async function getProducts() {
  try {
    return await db.select().from(products);
  } catch (error) {
    console.error('Get products error:', error);
    throw error;
  }
}

export async function createProduct(productData) {
  try {
    const newProduct = await db.insert(products).values(productData).returning();
    return newProduct[0];
  } catch (error) {
    console.error('Create product error:', error);
    throw error;
  }
}

export async function updateProduct(id, productData) {
  try {
    const updatedProduct = await db.update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct[0];
  } catch (error) {
    console.error('Update product error:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    await db.delete(products).where(eq(products.id, id));
    return true;
  } catch (error) {
    console.error('Delete product error:', error);
    throw error;
  }
}

// Sales Opportunity functions
export async function getSalesOpportunities() {
  try {
    return await db.select().from(salesOpportunities);
  } catch (error) {
    console.error('Get sales opportunities error:', error);
    throw error;
  }
}

export async function createSalesOpportunity(opportunityData) {
  try {
    const newOpportunity = await db.insert(salesOpportunities).values(opportunityData).returning();
    return newOpportunity[0];
  } catch (error) {
    console.error('Create sales opportunity error:', error);
    throw error;
  }
}