#!/bin/bash

echo "Starting LN Partners Korean Groupware System..."
echo "Employee Management with Vietnamese Labor Law Compliance"
echo "========================================================="

# Kill any existing processes
pkill -f "next dev"
pkill -f "node index.js"

sleep 2

# Start Next.js client
cd client-nextjs
npx next dev -p 3000 --hostname 0.0.0.0 &
CLIENT_PID=$!

# Start Express server  
cd ../server
node index.js &
SERVER_PID=$!

echo "Client started on port 3000 (PID: $CLIENT_PID)"
echo "Server started on port 3001 (PID: $SERVER_PID)"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Main features available:"
echo "- Employee Management Dashboard"
echo "- Vietnamese Labor Law Compliance"
echo "- Leave Management (12 days annual, 180 days maternity)"
echo "- Salary Management with automatic deductions"
echo "- Attendance Tracking"
echo "- Performance Evaluation"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "kill $CLIENT_PID $SERVER_PID; exit" INT
wait