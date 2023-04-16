FROM composer/composer:2-bin AS composer

FROM richarvey/nginx-php-fpm:2.1.0




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
ENV PATH="${PATH}:/root/.composer/vendor/bin"


ENV APP_ENV=prod



# get composer using multi-stage build
COPY --from=composer --link /composer /usr/bin/composer

# copy composer.lock and composer.json
COPY --link composer.* symfony.* ./
RUN composer install --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress; \
		composer clear-cache; 


# install bundles from composer.json with options for deployment
# RUN composer install --prefer-dist --no-dev --no-scripts --no-progress --no-interaction

# copy application files to default directory
COPY --link  . ./


RUN set -eux; \
	mkdir -p var/cache var/log; \
    if [ -f composer.json ]; then \
		composer dump-autoload --classmap-authoritative --no-dev; \
		composer dump-env prod; \
		composer run-script --no-dev post-install-cmd; \
		chmod +x bin/console; sync; \
    fi

# # migrations
# CMD ["php", "bin/console", "doctrine:migrations:migrate", "--no-interaction", "--allow-no-migration"]

# CMD ["/start.sh"]


# run composer dump-autload 
# RUN composer dump-autoload --optimize