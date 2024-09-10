# Use a Node.js 18 base image to install dependencies
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Install Graph CLI (needed to build and deploy subgraphs)
RUN npm install -g @graphprotocol/graph-cli pnpm

# Copy the subgraph files
COPY . .

# Install subgraph dependencies
RUN pnpm install

# Build the subgraph
RUN pnpm run codegen && pnpm run build

# Use Graph Node Docker image
FROM graphprotocol/graph-node:latest

# Expose ports for Graph Node
EXPOSE 8000 8001 8020 8030 8040

# Copy the configuration file to the root directory of the container
COPY graph-node-config.toml /graph-node-config.toml

# Define environment variables
# ENV CONFIG_FILE=/graph-node-config.toml

# Run Graph Node with the config file
CMD ["graph-node", "--config", "/graph-node-config.toml"]
# CMD ["ifconfig"]

# Start IPFS and then Graph Node
# CMD ["sh", "-c", "ipfs daemon & graph-node --config /graph-node-config.toml"]


# CMD ["graph-node --release -- \
#   --postgres-url postgresql://doadmin:AVNS_n0HSVIvpAdQpsGj4MAh@db-tenderly-subgraph-do-user-16241399-0.f.db.ondigitalocean.com:25060/defaultdb?sslmode=require \
#   --ethereum-rpc mainnet:https://virtual.mainnet.rpc.tenderly.co/8a8e6e24-ac21-49ce-b433-86d9e0c4469d \
#   --ipfs http://ipfs:5001"]




# Define environment variables
# ENV ETHEREUM_RPC = https://virtual.mainnet.rpc.tenderly.co/8a8e6e24-ac21-49ce-b433-86d9e0c4469d
# ENV IPFS = http://ipfs:5001
# ENV POSTGRES_URL = postgresql://doadmin:AVNS_n0HSVIvpAdQpsGj4MAh@db-tenderly-subgraph-do-user-16241399-0.f.db.ondigitalocean.com:25060/defaultdb?sslmode=require

# Run Graph Node
# CMD ["graph-node", \
#      "--postgres-url", "postgresql://doadmin:AVNS_n0HSVIvpAdQpsGj4MAh@db-tenderly-subgraph-do-user-16241399-0.f.db.ondigitalocean.com:25060/defaultdb?sslmode=require", \
#      "--ethereum-rpc", "mainnet:https://virtual.mainnet.rpc.tenderly.co/8a8e6e24-ac21-49ce-b433-86d9e0c4469d", \
#      "--ipfs", "http://127.0.0.1:5001", \
#      "--http-port", "8030", \
#      "--ws-port", "8031", \
#      "--admin-port", "8032", \
#      "--index-node-port", "8033"]
