# syntax=docker/dockerfile:1

# Static site — no build step, served directly by Caddy.
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY . /srv

EXPOSE 80
