FROM richarvey/nginx-php-fpm:2.1.0


RUN apk add --no-cache curl git build-base zlib-dev oniguruma-dev autoconf bash

# install php with pgsql
RUN set -ex \
  && apk --no-cache add \
    postgresql-dev

RUN docker-php-ext-install pdo pdo_pgsql


ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

ENV COMPOSER_ALLOW_SUPERUSER=1


ENV APP_ENV=prod



# get composer using multi-stage build
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# copy composer.lock and composer.json
COPY --link composer.* symfony.* ./
RUN composer install --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress; \
		composer clear-cache; 


# install bundles from composer.json with options for deployment
# RUN composer install --prefer-dist --no-dev --no-scripts --no-progress --no-interaction

# copy application files to default directory
COPY --link  . ./


RUN composer dump-autoload --classmap-authoritative --no-dev; 
# RUN composer dump-env prod; 
# RUN composer run-script --no-dev post-install-cmd; 


# # migrations
# CMD ["php", "bin/console", "doctrine:migrations:migrate", "--no-interaction", "--allow-no-migration"]

# CMD ["/start.sh"]


# run composer dump-autload 
# RUN composer dump-autoload --optimize