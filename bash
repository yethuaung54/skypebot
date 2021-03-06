#!/usr/bin/env bash

./synctime

claudia_version=$(cat "$(pwd)/.claudia-version" | tr -d "\r")

docker run --rm -ti -v "$(pwd):/myapp" -v "$(pwd)/.aws:/root/.aws" -e "AWS_PROFILE=claudia" "danlynn/claudia:$claudia_version" bash
