const fetch = require("node-fetch");

async function testAuthenticatedQuery() {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc0OTg4Mjg1MCwiZXhwIjoxNzUwNDg3NjUwfQ.-ee6yH57jHpMNl90ibD1a5cBmIzcpeO7UspyXcd-UdI";
    console.log("🔍 Testing authenticated queries...");

    // Test salesItems query
    const salesItemsResponse = await fetch("http://localhost:50021/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: "query { salesItems(page: 1, limit: 10) { salesItems { id } pagination { totalCount } } }",
      }),
    });

    const salesItemsResult = await salesItemsResponse.json();
    console.log("📋 SalesItems query result:", JSON.stringify(salesItemsResult, null, 2));

    // Test categories query
    const categoriesResponse = await fetch("http://localhost:50021/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: "query { categories(page: 1, limit: 10) { categories { id names { ko en vi } } pagination { totalCount } } }",
      }),
    });

    const categoriesResult = await categoriesResponse.json();
    console.log("📂 Categories query result:", JSON.stringify(categoriesResult, null, 2));

    console.log("✅ Authentication test completed");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testAuthenticatedQuery();
