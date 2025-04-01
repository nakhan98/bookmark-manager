docker_build:
	podman build -t aider-bookmark-manager .

docker_run:
	podman run --rm --name adm -v $(PWD):/app -p 3000:3000 aider-bookmark-manager

docker_install:
	podman run --rm --name install-adm -v $(PWD):/app aider-bookmark-manager npm install

docker_test:
	podman run --rm --name test-adm -v $(PWD):/app aider-bookmark-manager npm run test

dc_run:
	podman-compose up -d --force-recreate
