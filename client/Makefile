start:
	docker-compose up -d && \
	docker logs -f client_react-app_1

build:
	docker build \
		--tag gadget-budget:client \
		--build-arg API_URL=https://bitbudget.com \
		--target production \
		.

build-no-cache:
	docker build \
		--no-cache \
		--tag gadget-budget:client \
		--build-arg API_URL=https://bitbudget.com \
		--target production \
		.