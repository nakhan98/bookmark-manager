CONTAINER ?= podman
COMPOSE ?= podman-compose

docker_build:
	$(CONTAINER) build -t aider-bookmark-manager .

docker_run:
	$(CONTAINER) run --rm --name adm -v $(PWD):/app -p 3000:3000 aider-bookmark-manager

docker_install:
	$(CONTAINER) run --rm --name install-adm -v $(PWD):/app aider-bookmark-manager npm install

docker_test:
	$(CONTAINER) run --rm --name test-adm -v $(PWD):/app aider-bookmark-manager npm run test

dc_run:
	$(COMPOSE) up -d --force-recreate
