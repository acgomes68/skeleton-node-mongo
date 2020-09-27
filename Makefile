# Makefile for Docker Node.js MongoDB
include .env

# If the first argument is "add"...
ifeq (add,$(firstword $(MAKECMDGOALS)))
  # use the rest as arguments for "add"
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(RUN_ARGS):;@:)
endif

ifeq (remove,$(firstword $(MAKECMDGOALS)))
  # use the rest as arguments for "add"
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(RUN_ARGS):;@:)
endif

NODE_UP := $(shell docker-compose ps | grep node)
MONGO_UP := $(shell docker-compose ps | grep mongo)

help:
	@echo ""
	@echo "usage: make COMMAND"
	@echo ""
	@echo "Commands:"
	@echo "  add <package>      Install Node package with yarn"
	@echo "  clean              Drop database and clean dependencies"
	@echo "  help               Show this help screen"
	@echo "  install            Create and start containers, create database, run migrations and seeds"
	@echo "  logs               Watch log output"
	@echo "  remove <package>   Uninstall Node package with yarn"
	@echo "  restart            Restart all containers"
	@echo "  run                Run main service with curl"
	@echo "  start              Start all containers"
	@echo "  status             Show containers current status"
	@echo "  stop               Stop all services"
	@echo "  test               Run eslint and application unit tests "
	@echo "  uninstall          Stop and clear all services"
	@echo "  update             Update Node dependencies with yarn"

package: # ...
    # ...

init:
	@yarn
	@make node-up
	@docker-compose exec node yarn install

add: package
	@yarn add $(RUN_ARGS)
	@make update

clean:
	@make node-up
	@docker-compose exec node rm -Rf /home/node/app/node_modules

create-db:
	@make drop-db
	@docker-compose exec mongo mongo $(MONGO_DATABASE) --eval 'db.createCollection("User")'

drop-db:
	@make mongo-up
	@docker-compose exec mongo mongo $(MONGO_DATABASE) --eval 'db.dropDatabase()'

install: init
	@make start
	@make create-db
	@make seeds
	@make test

lint:
	@make node-up
	@docker-compose exec node yarn eslint --fix src --ext .js

logs:
	@docker-compose logs -f

node-up:
	@if [ "$(NODE_UP)" = '' ]; then\
		echo "Node is down";\
		docker-compose up -d --no-deps node;\
	else\
		echo "Node is up";\
	fi;

node-down:
	@if [ "$(NODE_UP)" = '' ]; then\
		echo "Node is down";\
	else\
		echo "Node is up";\
        docker-compose down -v node;\
	fi;

mongo-down:
	@if [ "$(MONGO_UP)" = '' ]; then\
		echo "Postgres is down";\
	else\
		echo "Postgres is up";\
        docker-compose down -v mongo;\
	fi;

mongo-up:
	@if [ "$(MONGO_UP)" = '' ]; then\
		echo "Postgres is down";\
		docker-compose up -d --no-deps mongo;\
	else\
		echo "Postgres is up";\
	fi;

remove: package
	@yarn remove $(RUN_ARGS)
	@make update

restart:
	@docker-compose restart

run:
	@curl ${APP_URL}:${APP_PORT}/users

seeds:
	@make node-up
	@docker-compose exec mongo mongo $(MONGO_DATABASE) --eval 'db.User.insert({"name": "test user", "email": "user@test.com", "createdAt": new Date(), "updatedAt": null })'

start:
	@docker-compose up -d

status:
	@docker-compose ps

stop:
	@docker-compose down -v --remove-orphans

test:
	@make lint
	@#make unit

uninstall:
	@make stop
	@make drop-db;
	@make clean

unit:
	@make node-up
	@docker-compose exec node yarn eslint --fix src --ext .js

update:
	@make node-up
	@docker-compose exec node yarn

.PHONY: clean test init
