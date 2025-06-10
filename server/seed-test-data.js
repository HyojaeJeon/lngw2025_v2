const { sequelize, User, Customer, Product, ProductModel } = require('./models');

async function seedTestData() {
  try {
    // Sales department 사용자 생성
    const salesUser = await User.findOrCreate({
      where: { email: 'sales1@example.com' },
      defaults: {
        name: '김영업',
        password: '$2b$10$u/okMr1ybqSzypci28e35e7fE5uwwEKf1QIUtubKzQIgynM5lPIaK',
        department: 'Sales',
        position: '과장',
        role: 'editor'
      }
    });
    
    const salesUser2 = await User.findOrCreate({
      where: { email: 'sales2@example.com' },
      defaults: {
        name: '박판매',
        password: '$2b$10$u/okMr1ybqSzypci28e35e7fE5uwwEKf1QIUtubKzQIgynM5lPIaK',
        department: 'Sales',
        position: '대리',
        role: 'editor'
      }
    });

    // 고객사 생성
    const customer1 = await Customer.findOrCreate({
      where: { name: 'ABC 전자' },
      defaults: {
        contactName: '이대표',
        email: 'lee@abc.com',
        phone: '02-1234-5678',
        grade: 'A',
        status: 'active',
        address: '서울시 강남구'
      }
    });

    const customer2 = await Customer.findOrCreate({
      where: { name: 'XYZ 무역' },
      defaults: {
        contactName: '최사장',
        email: 'choi@xyz.com',
        phone: '02-9876-5432',
        grade: 'B',
        status: 'active',
        address: '서울시 서초구'
      }
    });

    // 카테고리 생성
    const category = await sequelize.models.Category.findOrCreate({
      where: { code: 'ELECTRONICS' },
      defaults: {
        names: { ko: '전자제품', vi: 'Điện tử', en: 'Electronics' },
        level: 1,
        sortOrder: 1,
        isActive: true
      }
    });

    // 제품 생성
    const product1 = await Product.findOrCreate({
      where: { code: 'PROD001' },
      defaults: {
        name: '스마트폰 A1',
        categoryId: category[0].id,
        price: 800000,
        cost: 600000,
        currentStock: 100,
        minStock: 10,
        status: 'active'
      }
    });

    const product2 = await Product.findOrCreate({
      where: { code: 'PROD002' },
      defaults: {
        name: '노트북 B2',
        categoryId: category[0].id,
        price: 1500000,
        cost: 1200000,
        currentStock: 50,
        minStock: 5,
        status: 'active'
      }
    });

    // ProductModel 생성
    await ProductModel.findOrCreate({
      where: { productId: product1[0].id, modelCode: 'A1-64GB' },
      defaults: {
        modelName: 'A1 64GB',
        price: 800000,
        cost: 600000,
        currentStock: 50,
        status: 'active'
      }
    });

    await ProductModel.findOrCreate({
      where: { productId: product1[0].id, modelCode: 'A1-128GB' },
      defaults: {
        modelName: 'A1 128GB',
        price: 900000,
        cost: 680000,
        currentStock: 50,
        status: 'active'
      }
    });

    await ProductModel.findOrCreate({
      where: { productId: product2[0].id, modelCode: 'B2-i5' },
      defaults: {
        modelName: 'B2 Intel i5',
        price: 1500000,
        cost: 1200000,
        currentStock: 30,
        status: 'active'
      }
    });

    await ProductModel.findOrCreate({
      where: { productId: product2[0].id, modelCode: 'B2-i7' },
      defaults: {
        modelName: 'B2 Intel i7',
        price: 1800000,
        cost: 1400000,
        currentStock: 20,
        status: 'active'
      }
    });

    console.log('Test data seeded successfully!');
  } catch (error) {
    console.error('Error seeding test data:', error);
  } finally {
    await sequelize.close();
  }
}

seedTestData(); 