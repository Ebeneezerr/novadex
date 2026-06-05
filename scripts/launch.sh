#!/bin/bash
# One-click launch: deploy contracts, import ABIs/addresses, start frontend

set -e

cd ../..

echo "Deploying contracts to selected network..."
npm run deploy:all -- --network arcTestnet

echo "Importing contract addresses..."
cd dex-frontend
node scripts/import-contracts.js

echo "Importing contract ABIs..."
node scripts/import-abis.js

echo "Starting frontend..."
npm run dev
