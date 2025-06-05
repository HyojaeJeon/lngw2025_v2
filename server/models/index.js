const { Sequelize } = require("sequelize");
const config = require("../config/config.js");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    timezone: dbConfig.timezone,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
  },
);

// Import models
const User = require("./User")(sequelize, Sequelize.DataTypes);
const Experience = require("./Experience")(sequelize, Sequelize.DataTypes);
const Content = require("./Content")(sequelize, Sequelize.DataTypes);
const ScheduledPost = require("./ScheduledPost")(
  sequelize,
  Sequelize.DataTypes,
);
const PostingLog = require("./PostingLog")(sequelize, Sequelize.DataTypes);
const PlatformStat = require("./PlatformStat")(sequelize, Sequelize.DataTypes);
const TrendAnalysis = require("./TrendAnalysis")(
  sequelize,
  Sequelize.DataTypes,
);
const TrendingKeyword = require("./TrendingKeyword")(
  sequelize,
  Sequelize.DataTypes,
);
const ABTestGroup = require("./ABTestGroup")(sequelize, Sequelize.DataTypes);
const ABTestVariant = require("./ABTestVariant")(
  sequelize,
  Sequelize.DataTypes,
);
const ContentRecommendation = require("./ContentRecommendation")(
  sequelize,
  Sequelize.DataTypes,
);
const Skill = require("./Skill")(sequelize, Sequelize.DataTypes);
const EmergencyContact = require("./EmergencyContact")(
  sequelize,
  Sequelize.DataTypes,
);
const Customer = require("./Customer")(sequelize, Sequelize.DataTypes);
const ContactPerson = require("./ContactPerson")(
  sequelize,
  Sequelize.DataTypes,
);
const CustomerImage = require("./CustomerImage")(
  sequelize,
  Sequelize.DataTypes,
);
const SalesOpportunity = require("./SalesOpportunity")(
  sequelize,
  Sequelize.DataTypes,
);
const Address = require("./Address")(sequelize, Sequelize.DataTypes);
const Service = require("./Service")(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Experience, {
  foreignKey: "userId",
  as: "experiences",
});
Experience.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Skill, {
  foreignKey: "userId",
  as: "skills",
});
Skill.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(EmergencyContact, {
  foreignKey: "userId",
  as: "emergencyContact",
});
EmergencyContact.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Content.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
User.hasMany(Content, {
  foreignKey: "userId",
  as: "contents",
});

Content.hasMany(ScheduledPost, {
  foreignKey: "contentId",
  as: "scheduledPosts",
});

ScheduledPost.belongsTo(Content, {
  foreignKey: "contentId",
  as: "content",
});

Content.hasMany(PostingLog, {
  foreignKey: "contentId",
  as: "postingLogs",
});

PostingLog.belongsTo(Content, {
  foreignKey: "contentId",
  as: "content",
});

ABTestGroup.hasMany(ABTestVariant, {
  foreignKey: "groupId",
  as: "variants",
});

ABTestVariant.belongsTo(ABTestGroup, {
  foreignKey: "groupId",
  as: "group",
});

TrendAnalysis.hasMany(TrendingKeyword, {
  foreignKey: "trendId",
  as: "keywords",
});

TrendingKeyword.belongsTo(TrendAnalysis, {
  foreignKey: "trendId",
  as: "trend",
});

// Customer - User associations (User can have many customers assigned)
User.hasMany(Customer, {
  foreignKey: "assignedUserId",
  as: "assignedCustomers",
});
Customer.belongsTo(User, {
  foreignKey: "assignedUserId",
  as: "assignedUser",
});

// Customer - ContactPerson associations
Customer.hasMany(ContactPerson, {
  foreignKey: "customerId",
  as: "contacts",
  onDelete: "CASCADE",
});
ContactPerson.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
});

// Customer - CustomerImage associations
Customer.hasMany(CustomerImage, {
  foreignKey: "customerId",
  as: "facilityImages",
  onDelete: "CASCADE",
});
CustomerImage.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
});

// Customer - SalesOpportunity associations
Customer.hasMany(SalesOpportunity, {
  foreignKey: "customerId",
  as: "opportunities",
});
SalesOpportunity.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
});

// User - SalesOpportunity associations
User.hasMany(SalesOpportunity, {
  foreignKey: "assignedUserId",
  as: "assignedOpportunities",
});
SalesOpportunity.belongsTo(User, {
  foreignKey: "assignedUserId",
  as: "assignedUser",
});

const models = {
  sequelize,
  Sequelize,
  User,
  Experience,
  Content,
  ScheduledPost,
  PostingLog,
  PlatformStat,
  TrendAnalysis,
  TrendingKeyword,
  ABTestGroup,
  ABTestVariant,
  ContentRecommendation,
  Skill,
  EmergencyContact,
  Customer,
  ContactPerson,
  CustomerImage,
  SalesOpportunity,
  Address,
  Service,
};

module.exports = models;
