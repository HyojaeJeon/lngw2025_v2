/**
 * Simple test to check if server is running and accessible
 */

const http = require("http");

async function testServerHealth() {
  try {
    console.log("🧪 Testing server health..."); // Test query for categories (might not require auth)
    const query = `
      query TestQuery {
        categories(page: 1, limit: 5) {
          success
          message
          categories {
            id
            code
            names {
              ko
              en
              vi
            }
            isActive
          }
        }
      }
    `;

    const postData = JSON.stringify({
      query,
      variables: {},
    });

    const response = await makeGraphQLRequest(postData);

    if (response.errors) {
      console.log("❌ GraphQL errors:", response.errors);
      return;
    }

    if (response.data) {
      console.log("✅ Server is responding successfully!");
      console.log("📊 Categories found:", response.data.categories?.categories?.length || 0);

      if (response.data.categories?.categories?.length > 0) {
        console.log("📋 Sample categories:");
        response.data.categories.categories.slice(0, 3).forEach((cat, index) => {
          console.log(`  ${index + 1}. ${cat.code} - ${cat.names?.ko || "N/A"}`);
        });
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

function makeGraphQLRequest(postData) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/graphql",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          console.error("Failed to parse JSON:", data);
          reject(new Error("Invalid JSON response"));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

testServerHealth();
