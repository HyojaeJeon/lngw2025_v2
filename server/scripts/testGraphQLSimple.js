/**
 * Test script to verify GraphQL queries for sales data
 */

const fetch = require("node-fetch");

async function testSalesQueries() {
  try {
    console.log("🧪 Testing GraphQL sales queries...");

    // Test query for sales items
    const query = `
      query GetSalesItems($page: Int, $limit: Int) {
        salesItems(page: $page, limit: $limit) {
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
            cost
            totalCost
            margin
            totalMargin
            finalMargin
            marginRate
            paymentStatus
            paidAmount
            salesItemCode
            productIncentiveA
            productIncentiveB
            originalUnitCost
            adjustedUnitCost
            shippingCost
            otherCosts
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
            category {
              id
              names
            }
            product {
              id
              name
              code
            }
            productModel {
              id
              modelName
              modelCode
            }
          }
          pagination {
            total
            page
            pages
            limit
          }
        }
      }
    `;

    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          page: 1,
          limit: 10,
        },
      }),
    });

    const result = await response.json();

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
      console.log(`- Model: ${sampleItem.productModel?.modelName || "N/A"}`);
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
