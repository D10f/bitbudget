VERSION := $(shell grep version package.json | awk '{print $$2}' | sed s/[\",]//g)

start:
	docker compose up -d && \
	docker logs -f server-node-1

build:
	docker build \
		--tag folious/bitbudget-server:latest \
		--tag folious/bitbudget-server:${VERSION} \
		--target production \
		.

build-no-cache:
	docker build \
		--no-cache \
		--tag folious/bitbudget-server:latest \
		--tag folious/bitbudget-server:${VERSION} \
		--target production \
		.

test:
	docker build \
		--rm \
		--tag folious/bitbudget-server-test \
		--target test \
		. && \
	docker run --rm -it folious/bitbudget-server-test
