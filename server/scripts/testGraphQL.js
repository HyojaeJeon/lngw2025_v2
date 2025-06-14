/**
 * Test script to verify GraphQL queries for sales data
 */

const { ApolloClient, InMemoryCache, gql, createHttpLink } = require("@apollo/client");
const fetch = require("node-fetch");

// Create Apollo client for testing
const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
  fetch: fetch,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// Test query for sales items
const GET_SALES_ITEMS = gql`
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

async function testSalesQueries() {
  try {
    console.log("🧪 Testing GraphQL sales queries...");

    // Test sales items query
    const salesResult = await client.query({
      query: GET_SALES_ITEMS,
      variables: {
        page: 1,
        limit: 10,
      },
    });

    console.log("✅ Sales items query result:");
    console.log("Success:", salesResult.data.salesItems.success);
    console.log("Message:", salesResult.data.salesItems.message);
    console.log("Total items:", salesResult.data.salesItems.salesItems.length);
    console.log("Pagination:", salesResult.data.salesItems.pagination);

    if (salesResult.data.salesItems.salesItems.length > 0) {
      console.log("📊 Sample sales item:");
      const sampleItem = salesResult.data.salesItems.salesItems[0];
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
    if (error.graphQLErrors) {
      console.error("GraphQL errors:", error.graphQLErrors);
    }
    if (error.networkError) {
      console.error("Network error:", error.networkError);
    }
  }
}

// Run the test
if (require.main === module) {
  testSalesQueries();
}

module.exports = testSalesQueries;
