#FROM ghcr.io/oracle/oraclelinux8-nodejs:16
FROM node:16.14

# Create app directory
WORKDIR /usr/src/app

# Copy the .js files from your host machine into the new app directory
COPY . .


#RUN dnf -y install oracle-instantclient-release-el8 && \
#    dnf -y install oracle-instantclient-basic oracle-instantclient-devel oracle-instantclient-sqlplus && \
#    rm -rf /var/cache/dnf && \
#    npm ci

RUN apt-get update && apt-get -y upgrade && apt-get -y dist-upgrade && apt-get install -y alien libaio1 && \
    wget https://download.oracle.com/otn_software/linux/instantclient/215000/oracle-instantclient-basic-21.5.0.0.0-1.el8.x86_64.rpm && \
    alien -i --scripts oracle-instantclient*.rpm && \
    rm -f oracle-instantclient21.5*.rpm && apt-get -y autoremove && apt-get -y clean && \
      npm ci

ENV LANG ru_RU.UTF-8
ENV LANGUAGE ru_RU:ru
ENV LC_LANG ru_RU.UTF-8
ENV LC_ALL ru_RU.UTF-8
ENV TZ="Europe/Moscow"
ENV NODE_ENV production



EXPOSE 4200

CMD ["npm", "run", "server"]