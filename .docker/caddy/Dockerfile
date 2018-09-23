#
# Build stage by @abiosoft https://github.com/abiosoft/caddy-docker
#
FROM golang:1.10-alpine as build

# args
ARG version="0.11.0"
ARG plugins=""

# deps
RUN apk add --no-cache git

# source
RUN git clone https://github.com/mholt/caddy -b "v${version}" $GOPATH/src/github.com/mholt/caddy
WORKDIR $GOPATH/src/github.com/mholt/caddy
RUN git checkout -b "v${version}"

# plugin helper
RUN go get -v github.com/abiosoft/caddyplug/caddyplug

# plugins
RUN for plugin in $(echo $plugins | tr "," " "); do \
    go get -v $(caddyplug package $plugin); \
    printf "package caddyhttp\nimport _ \"$(caddyplug package $plugin)\"" > \
        $GOPATH/src/github.com/mholt/caddy/caddyhttp/$plugin.go ; \
    done

# builder dependency
RUN git clone https://github.com/caddyserver/builds $GOPATH/src/github.com/caddyserver/builds

# build
WORKDIR $GOPATH/src/github.com/mholt/caddy/caddy
RUN git checkout -f
RUN go run build.go
RUN mv caddy /usr/bin/caddy

WORKDIR /srv

CMD ["/usr/bin/caddy", "--conf", "/srv/.docker/caddy/Caddyfile"]
