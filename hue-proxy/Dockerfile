ARG BUILD_FROM=ghcr.io/hassio-addons/base/amd64:9.1.2
FROM $BUILD_FROM

ENV LANG C.UTF-8

RUN apk add --no-cache nodejs nodejs-npm

WORKDIR /app

ADD package.json /app
ADD package-lock.json /app
RUN npm install

ENV OPTIONS_PATH /data/options.json

ADD ./ /app

RUN chmod +x /app/run.sh

CMD [ "/app/run.sh" ]
