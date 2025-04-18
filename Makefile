CONTAINER_RUNTIME ?= podman
HTPASSWD_USER ?= admin

docker_build:
	$(CONTAINER_RUNTIME) build -t aider-bookmark-manager .

docker_run:
	$(CONTAINER_RUNTIME) run --rm --name adm -v $(PWD):/app -p 3000:3000 aider-bookmark-manager

docker_install:
	$(CONTAINER_RUNTIME) run --rm --name install-adm -v $(PWD):/app aider-bookmark-manager npm install

docker_test:
	$(CONTAINER_RUNTIME) run --rm --name test-adm -v $(PWD):/app aider-bookmark-manager npm run test

dc_run:
	$(CONTAINER_RUNTIME) compose up -d --force-recreate

docker_htpasswd:
	$(CONTAINER_RUNTIME) run --rm -it -v $(PWD)/nginx/auth:/auth httpd htpasswd /auth/.htpasswd $(HTPASSWD_USER)
