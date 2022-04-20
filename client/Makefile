start:
	node_modules/.bin/craco start

build:
	docker build \
		--tag gadget-budget:client \
		--build-arg API_URL=https://gadgetbudget.com \
		--target production \
		.

build-no-cache:
	docker build \
		--no-cache \
		--tag gadget-budget:client \
		--build-arg API_URL=https://gadgetbudget.com \
		--target production \
		.