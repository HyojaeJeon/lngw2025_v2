const { Kind } = require("graphql/language");
const { merge } = require("lodash");
const { GraphQLJSON } = require("graphql-scalars");

// 메뉴별 리졸버 import
const contentResolvers = require("../resolvers/marketing/content");
const dashboardResolvers = require("../resolvers/marketing/dashboard");
const insightsResolvers = require("../resolvers/marketing/insights");
const trendsResolvers = require("../resolvers/marketing/trends");
const monitoringResolvers = require("../resolvers/marketing/monitoring");
const postsResolvers = require("../resolvers/marketing/posts");
const abtestResolvers = require("../resolvers/marketing/abtest");
const engagementResolvers = require("../resolvers/marketing/engagement");
const authResolvers = require("../resolvers/auth");
const customerResolvers = require("../resolvers/customer");
const categoryResolvers = require('../resolvers/category');

// Date 스칼라 타입 처리
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

// 모든 리졸버를 병합
module.exports = merge(
  scalarResolvers,
  contentResolvers,
  trendsResolvers,
  monitoringResolvers,
  abtestResolvers,
  dashboardResolvers,
  engagementResolvers,
  insightsResolvers,
  postsResolvers,
  authResolvers,
  customerResolvers,
  categoryResolvers,
);