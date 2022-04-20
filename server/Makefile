start:
	docker-compose up -d && \
	docker logs -f server_node_1

build:
	docker build \
		--tag gadget-budget:server \
		--target production \
		.

build-no-cache:
	docker build \
		--no-cache \
		--tag gadget-budget:server \
		--target production \
		.

test:
	docker build \
		--rm \
		--tag gadget-budget:server-test \
		--target test \
		. && \
	docker run --rm -it gadget-budget:server-test