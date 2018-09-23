FROM node:8.12.0-alpine

RUN apk --update add git openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

RUN apk add --no-cache curl

# # Install Zsh
RUN apk add --no-cache zsh
RUN git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh \
      && cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
RUN cd /usr/src/app

RUN npm i -g @feathers-plus/cli --unsafe-perm=true --allow-root

# Install app dependencies
RUN npm install

CMD [ "node" ]
