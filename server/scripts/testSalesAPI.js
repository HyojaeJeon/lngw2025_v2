/**
 * Test script to verify GraphQL queries for sales data using native Node.js
 */

const http = require("http");

async function testSalesQueries() {
  try {
    console.log("🧪 Testing GraphQL sales queries...");

    // Test query for sales items
    const query = `
      query GetSalesItems {
        salesItems(page: 1, limit: 10) {
          success
          message
          salesItems {
            id
            salesDate
            type
            quantity
            unitPrice
            salesPrice
            totalPrice
            paymentStatus
            paidAmount
            salesItemCode
            productIncentiveA
            productIncentiveB
            notes
            salesRep {
              id
              name
              email
            }
            customer {
              id
              name
              contactName
            }
            product {
              id
              name
              code
            }
          }          pagination {
            total
            page
            totalPages
            limit
          }
        }
      }
    `;

    const postData = JSON.stringify({
      query,
      variables: {},
    });

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

    const result = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
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

    if (result.errors) {
      console.error("❌ GraphQL errors:", result.errors);
      return;
    }

    console.log("✅ Sales items query result:");
    console.log("Success:", result.data.salesItems.success);
    console.log("Message:", result.data.salesItems.message);
    console.log("Total items:", result.data.salesItems.salesItems.length);
    console.log("Pagination:", result.data.salesItems.pagination);

    if (result.data.salesItems.salesItems.length > 0) {
      console.log("📊 Sample sales item:");
      const sampleItem = result.data.salesItems.salesItems[0];
      console.log(`- ID: ${sampleItem.id}`);
      console.log(`- Date: ${sampleItem.salesDate}`);
      console.log(`- Type: ${sampleItem.type}`);
      console.log(`- Sales Rep: ${sampleItem.salesRep?.name}`);
      console.log(`- Customer: ${sampleItem.customer?.name}`);
      console.log(`- Product: ${sampleItem.product?.name}`);
      console.log(`- Total Price: ${sampleItem.totalPrice}`);
      console.log(`- Payment Status: ${sampleItem.paymentStatus}`);
      console.log(`- Incentive A: ${sampleItem.productIncentiveA}`);
      console.log(`- Incentive B: ${sampleItem.productIncentiveB}`);
    }

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
if (require.main === module) {
  testSalesQueries();
}

module.exports = testSalesQueries;
