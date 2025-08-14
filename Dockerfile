# -------- Stage 1: Build the custom node package --------
FROM node:20-bookworm AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy only those files required to install dependencies and build
COPY package.json package-lock.json tsconfig.json gulpfile.js ./
COPY credentials ./credentials
COPY nodes ./nodes

# Install dependencies and build the package
RUN npm ci \
 && npm run build

# -------- Stage 2: Create final runtime image with n8n installed from npm --------
FROM node:20-bookworm AS runtime

# Install n8n globally (can pin version via --@version)
USER root
RUN npm install -g n8n

# Directory where n8n looks for custom extensions
ENV N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom

# Copy the compiled custom node package into a temp location
COPY --from=builder /usr/src/app /opt/imagerouter

# Ensure extension directory exists and correct ownership
RUN mkdir -p ${N8N_CUSTOM_EXTENSIONS} \
    && chown -R node:node /home/node/.n8n /opt/imagerouter

# 1) Build the package and publish it to npm’s global link store (requires root permissions)
RUN cd /opt/imagerouter && npm run build && npm link \
    && chown -R node:node /usr/local/lib/node_modules/n8n-nodes-imagerouter

# Switch to the node user and link the package inside ~/.n8n/custom
USER node

# 2) Initialise ~/.n8n/custom project (if missing) and link the package into it
RUN mkdir -p ${N8N_CUSTOM_EXTENSIONS} \
    && cd ${N8N_CUSTOM_EXTENSIONS} \
    && ( [ -f package.json ] || npm init -y ) \
    && npm link n8n-nodes-imagerouter

# Expose default n8n port and set the startup command
EXPOSE 5678
CMD ["n8n", "start"]
