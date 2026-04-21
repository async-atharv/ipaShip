# ──────────────────────────────────────────────────────────────
#  ipaShip — Docker Image
#  Build:  docker build -t ipaship .
#  Run:    docker run --rm -v $(pwd):/app -e GEMINI_API_KEY=xxx ipaship --dir /app
# ──────────────────────────────────────────────────────────────

FROM node:20-alpine

LABEL maintainer="async-atharv"
LABEL description="ipaShip — AI-powered App Store compliance audit CLI"
LABEL version="1.3.0"

# Install ipaShip globally
RUN npm install -g @async-atharv/ipaship && \
    npm cache clean --force

# Default working directory for mounted projects
WORKDIR /app

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s CMD ipaShip --version || exit 1

# Default entrypoint
ENTRYPOINT ["ipaShip"]
CMD ["--help"]
