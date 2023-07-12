build:
	docker build -t reg.stickinteractive.com/mai/backend:latest .

push:
	docker push reg.stickinteractive.com/mai/backend:latest

deploy: build | push

dev:
	yarn start:dev
