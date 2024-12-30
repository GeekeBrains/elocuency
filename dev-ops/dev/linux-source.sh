## Elocuency ------------------------------------------------------------
export ELOCUENCY_PATH="/Users/joshua/my-docs/code/elocuency"
export ELOCUENCY_ENV="dev"
export ELOCUENCY_INFRA="localstack"
export ELOCUENCY_INFRA_REGION="us-east-1"
export ELOCUENCY_INFRA_PREFIX="elo-dev-"

elo() {
    cd "$ELOCUENCY_PATH" || return
    nx run "$@"
    cd - > /dev/null
}
