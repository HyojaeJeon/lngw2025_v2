const { mergeTypeDefs } = require("@graphql-tools/merge");

// ====================
// BASE TYPES IMPORT
// ====================
const types = require("./types");

// ====================
// SCHEMA IMPORTS
// ====================

// Auth schema
const authSchema = require("./auth");

// Customer schema
const customerSchema = require("./customer");
const customerActivitySchema = require("./customerActivity");

// Category schema
const categorySchema = require("./category");

// Product schema
const productSchema = require("./product");

// Sales schema
const salesSchema = require("./sales");

// Marketing schemas
const contentSchema = require("./marketing/content");
const dashboardSchema = require("./marketing/dashboard");
const insightsSchema = require("./marketing/insights");
const trendsSchema = require("./marketing/trends");
const monitoringSchema = require("./marketing/monitoring");
const postsSchema = require("./marketing/posts");
const abtestSchema = require("./marketing/abtest");
const engagementSchema = require("./marketing/engagement");
const roleSchema = require("./role/index");
const vocSchema = require("./voc/index");
const employeeSchema = require("./employee/index");

// ====================
// MERGE ALL SCHEMAS
// ====================
const typeDefs = mergeTypeDefs([
  types,
  authSchema,
  customerSchema,
  customerActivitySchema,
  categorySchema,
  productSchema,
  salesSchema,
  contentSchema,
  dashboardSchema,
  insightsSchema,
  trendsSchema,
  monitoringSchema,
  postsSchema,
  abtestSchema,
  engagementSchema,
  roleSchema,
  vocSchema,
  employeeSchema,
]);

module.exports = typeDefs;