const { Sequelize } = require("sequelize");
const config = require("../config/config.js");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// Replit 환경 감지 - 더 확실한 감지
const isReplit = !!(
  process.env.REPLIT || 
  process.env.REPLIT_DB_URL || 
  process.env.REPL_ID ||
  process.env.REPL_SLUG ||
  process.cwd().includes('/home/runner') ||
  process.env.DB_DIALECT === 'sqlite'
);

console.log("🔧 Models - Environment:", env);
console.log("🔧 Models - Is Replit:", isReplit);
console.log("🔧 Models - Database dialect:", dbConfig.dialect);
console.log("🔧 Models - Database config:", {
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  host: dbConfig.host,
  database: dbConfig.database
});

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    storage: dbConfig.storage, // SQLite용
    timezone: dbConfig.dialect === 'sqlite' ? undefined : dbConfig.timezone, // SQLite에서는 timezone 제거
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    retry: dbConfig.retry
  }
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
const MarketingPlan = require("./MarketingPlan")(sequelize, Sequelize.DataTypes);
const MarketingObjective = require("./MarketingObjective")(sequelize, Sequelize.DataTypes);
const KeyResult = require("./KeyResult")(sequelize, Sequelize.DataTypes);
const ChecklistItem = require("./ChecklistItem")(sequelize, Sequelize.DataTypes);
const Category = require("./Category")(sequelize, Sequelize.DataTypes);
const Product = require("./Product")(sequelize, Sequelize.DataTypes);
const ProductModel = require("./ProductModel")(sequelize, Sequelize.DataTypes);
const ProductTag = require("./ProductTag")(sequelize, Sequelize.DataTypes);
const SalesItem = require("./SalesItem")(sequelize, Sequelize.DataTypes);
const Payment = require("./Payment")(sequelize, Sequelize.DataTypes);
const Warehouse = require("./Warehouse")(sequelize, Sequelize.DataTypes);
const InventoryRecord = require("./InventoryRecord")(sequelize, Sequelize.DataTypes);
const StockMovement = require("./StockMovement")(sequelize, Sequelize.DataTypes);

// 모든 모델이 로드된 후 관계 설정
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
  MarketingPlan,
  MarketingObjective,
  KeyResult,
  ChecklistItem,
  Category,
  Product,
  ProductModel,
  ProductTag,
  SalesItem,
  Payment,
  Warehouse,
  InventoryRecord,
  StockMovement
};

// Associate 함수 호출 - 모든 모델이 준비된 후
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// 테이블 생성 순서 정의
const syncOrder = [
  'User',
  'Category',
  'Product',
  'ProductModel',
  'ProductTag',
  'Warehouse',
  'Customer',
  'ContactPerson',
  'CustomerImage',
  'Address',
  'Service',
  'SalesOpportunity',
  'SalesItem',
  'Payment',
  'InventoryRecord',
  'StockMovement',
  'MarketingPlan',
  'MarketingObjective',
  'KeyResult',
  'ChecklistItem',
  'Content',
  'ScheduledPost',
  'PostingLog',
  'PlatformStat',
  'TrendAnalysis',
  'TrendingKeyword',
  'ABTestGroup',
  'ABTestVariant',
  'ContentRecommendation',
  'Skill',
  'EmergencyContact',
  'Experience'
];

// 데이터베이스 동기화 함수
const syncDatabase = async () => {
  try {
    // force: false로 설정하여 기존 테이블 유지
    await sequelize.sync({ force: false });
    
    // 순서대로 테이블 동기화
    for (const modelName of syncOrder) {
      if (models[modelName]) {
        await models[modelName].sync({ force: false });
        console.log(`Synced table: ${modelName}`);
      }
    }
    
    console.log('Database sync completed successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

// syncDatabase 함수를 모듈에 추가
models.syncDatabase = syncDatabase;

module.exports = models;