const { Kind } = require("graphql/language");
const { merge } = require("lodash");
const { GraphQLJSON } = require("graphql-scalars");

// ====================
// RESOLVER IMPORTS
// ====================

// Auth resolvers
const authResolvers = require("./auth/index");

// Customer resolvers
const customerResolvers = require("./customer/index");
const customerActivityResolvers = require("./customerActivity/index");

// Category resolvers
const categoryResolvers = require("./category/index");

// Product resolvers
const productResolvers = require("./product/index");

// Sales resolvers
const salesResolvers = require("./sales/index");

// Marketing resolvers
const contentResolvers = require("./marketing/content");
const dashboardResolvers = require("./marketing/dashboard");
const insightsResolvers = require("./marketing/insights");
const trendsResolvers = require("./marketing/trends");
const monitoringResolvers = require("./marketing/monitoring");
const postsResolvers = require("./marketing/posts");
const abtestResolvers = require("./marketing/abtest");
const engagementResolvers = require("./marketing/engagement");
const roleResolvers = require("./role/index");
const vocResolvers = require("./voc/index");
const employeeResolvers = require("./employee/index");

// ====================
// SCALAR RESOLVERS
// ====================
const scalarResolvers = {
  Date: {
    __parseValue(value) {
      return new Date(value);
    },
    __serialize(value) {
      return value.toISOString();
    },
    __parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  },
  JSON: GraphQLJSON,
};

// ====================
// MERGE ALL RESOLVERS
// ====================
const resolvers = merge(
  scalarResolvers,
  authResolvers,
  customerResolvers,
  customerActivityResolvers,
  categoryResolvers,
  productResolvers,
  salesResolvers,
  contentResolvers,
  dashboardResolvers,
  insightsResolvers,
  trendsResolvers,
  monitoringResolvers,
  postsResolvers,
  abtestResolvers,
  engagementResolvers,
  roleResolvers,
  vocResolvers,
  employeeResolvers
);

module.exports = resolvers;