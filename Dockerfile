FROM bitnami/node:18

WORKDIR /app
ENV NODE_OPTIONS=--max_old_space_size=4048

COPY --chown=root:root . .
RUN npm install -f && \
npm install -g npm serve && \
npm run build:stag

RUN chmod 777 /app
RUN install_packages python3
RUN ln -sf python3 /usr/bin/python && \
pip3 install --no-cache -r test/requirements.txt && \
npx playwright install-deps
RUN rfbrowser init

USER root
