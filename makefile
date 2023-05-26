.DEFAULT_GOAL := all
MAKEFLAGS += --no-builtin-rules
SHELL         := bash

# All of these make commands must be called in root directory

# run docker
docker:
	docker run -p 3000:3000 lorenzomtzz/frontend

# run docker-compose
docker-compose:
	docker-compose up --build --force-recreate

all:

# check files, check their existence with make check
CFILES :=                                 \
    .gitignore                            \
    .gitlab-ci.yml                        

# check the existence of check files
check: $(CFILES)

# remove temporary files
clean:
	rm -f  *.tmp
	rm -rf __pycache__