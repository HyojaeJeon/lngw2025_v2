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

// Marketing schemas
const contentSchema = require("./marketing/content");
const dashboardSchema = require("./marketing/dashboard");
const insightsSchema = require("./marketing/insights");
const trendsSchema = require("./marketing/trends");
const monitoringSchema = require("./marketing/monitoring");
const postsSchema = require("./marketing/posts");
const abtestSchema = require("./marketing/abtest");
const engagementSchema = require("./marketing/engagement");

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
  contentSchema,
  dashboardSchema,
  insightsSchema,
  trendsSchema,
  monitoringSchema,
  postsSchema,
  abtestSchema,
  engagementSchema,
]);

module.exports = typeDefs;