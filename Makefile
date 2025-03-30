docker_build:
	podman build -t aider-bookmark-manager .

docker_run:
	podman run --rm -it --name adm -v $(PWD):/app -p 3000:3000 aider-bookmark-manager

docker_test:
	podman run --rm -it --name test-adm -v $(PWD):/app aider-bookmark-manager npm run test
