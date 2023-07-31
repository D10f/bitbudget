VERSION = $(shell grep -m 1 version package.json | awk '{print $$2}' | sed s/[\",]//g)

start:
	docker compose -f docker-compose.dev.yml up -d && \
	docker logs -f client-react-app-1

build:
	docker build \
		--tag folious/bitbudget-client:latest \
		--tag folious/bitbudget-client:${VERSION} \
		--build-arg API_URL=https://bitbudget.eu \
		--target production \
		.

build-no-cache:
	docker build \
		--no-cache \
		--tag folious/bitbudget-client:latest \
		--tag folious/bitbudget-client:${VERSION} \
		--build-arg API_URL=https://bitbudget.eu \
		--target production \
		.
