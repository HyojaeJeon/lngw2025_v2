const db = require('../models');

async function testConnection() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ 데이터베이스 연결 성공');
    
    // 모델 확인
    console.log('모델 로딩 확인:');
    console.log('- SalesItem:', !!db.SalesItem);
    console.log('- SalesRep:', !!db.SalesRep);
    console.log('- Customer:', !!db.Customer);
    console.log('- Product:', !!db.Product);
    console.log('- Category:', !!db.Category);
    console.log('- ProductModel:', !!db.ProductModel);
    
    await db.sequelize.close();
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

testConnection();
