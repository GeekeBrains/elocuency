# Install

## Prerequisites

- Install node (v20 or superior): https://nodejs.org/en/download
- Install docker (only engine is necesary): https://docs.docker.com/engine/install/
- install git: https://github.com/git-guides/install-git

## Installing

1. Clone repository.

```dos
> git clone https://github.com/GeekeBrains/elocuency
```

2. Modify shell profile.

Add this text to the end of your user profile, changing <PATH_TO_ELOCUENCY> whit your values.

```dos
## Elocuency ------------------------------------------------------------
export ELOCUENCY_PATH="<PATH_TO_ELOCUENCY>"
export ELOCUENCY_ENV="local"
export ELOCUENCY_INFRA="localstack"
export ELOCUENCY_INFRA_REGION="us-west-2"
export ELOCUENCY_INFRA_PREFIX="elo-dev-"

elo() {
    cd "$ELOCUENCY_PATH" || return
    nx run "$@"
    cd - > /dev/null
}
## Elocuency END --------------------------------------------------------
```

- On mac

```dos
> nano ~/.zshrc
# Add text and save
> source ~/.zshrc
```

3. Install system

```dos
> elo system:install
```
