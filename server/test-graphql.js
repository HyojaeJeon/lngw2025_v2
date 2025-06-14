const http = require("http");

// GraphQL 쿼리 테스트
const testQueries = [
  {
    name: "categories",
    query: `query { categories { success categories { id code names { ko en vi } isActive } } }`,
  },
  {
    name: "salesReps",
    query: `query { salesReps { id name email role } }`,
  },
  {
    name: "customersForSales",
    query: `query { customersForSales { id companyName contactName email } }`,
  },
  {
    name: "productsForSales",
    query: `query { productsForSales { id name sku description } }`,
  },
  {
    name: "salesItems",
    query: `query { salesItems { success salesItems { id quantity unitPrice totalCost salesDate paymentStatus type notes } pagination { currentPage totalPages totalCount } } }`,
  },
];

async function testGraphQL() {
  console.log("🔍 GraphQL 쿼리 테스트 시작...");

  for (const test of testQueries) {
    try {
      console.log(`\n📋 ${test.name} 쿼리 테스트 중...`);

      const postData = JSON.stringify({
        query: test.query,
      });
      const options = {
        hostname: "localhost",
        port: 5000,
        path: "/graphql",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJyb2xlIjoiZWRpdG9yIiwiaWF0IjoxNzQ5ODg0MDU3LCJleHAiOjE3NDk5NzA0NTd9.dUWacy-gFKXhSVeTBzgKCnEXubLEUG8BUbMbPN1BXww",
        },
      };

      const req = http.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const response = JSON.parse(data);

            if (response.errors) {
              console.log(`❌ ${test.name} 오류:`, response.errors);
            } else {
              console.log(`✅ ${test.name} 성공:`, Object.keys(response.data || {}));
              if (response.data && response.data[test.name]) {
                const result = response.data[test.name];
                if (Array.isArray(result)) {
                  console.log(`   - 결과 개수: ${result.length}`);
                } else if (result.success !== undefined) {
                  console.log(`   - 성공 여부: ${result.success}`);
                  if (result.salesItems) {
                    console.log(`   - 매출 항목 개수: ${result.salesItems.length}`);
                  }
                }
              }
            }
          } catch (parseError) {
            console.log(`❌ ${test.name} 응답 파싱 오류:`, parseError.message);
            console.log("응답 데이터:", data);
          }
        });
      });

      req.on("error", (err) => {
        console.log(`❌ ${test.name} 요청 오류:`, err.message);
      });

      req.write(postData);
      req.end();

      // 요청 간 딜레이
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`❌ ${test.name} 테스트 오류:`, error.message);
    }
  }
}

// 실행
if (require.main === module) {
  testGraphQL()
    .then(() => {
      console.log("\n🎉 GraphQL 테스트 완료!");
      setTimeout(() => process.exit(0), 2000);
    })
    .catch((error) => {
      console.error("❌ 테스트 실패:", error);
      process.exit(1);
    });
}

module.exports = { testGraphQL };
