## Create and deploy bff lambda ##
buildName="elo-server"
# layerArn="arn:aws:lambda:$awsRegion:$awsAccountId:layer:elo-bff-node-modules-layer:9"

echo "https://localhost.localstack.cloud:4566/000000000000/$ELOCUENCY_INFRA_PREFIX$buildName"
awslocal sqs send-message \
  --queue-url https://localhost.localstack.cloud:4566/000000000000/$ELOCUENCY_INFRA_PREFIX$buildName \
  --message-body "{ \
    \"action\": \"ChatMsg\", \
    \"payload\": { \
      \"body\": \"Que pasa tronko!\", \
      \"chatId\": \"chatId\", \
      \"userId\": \"A-language-teacher\" \
    } \
  }"


# awslocal logs get-log-events \
#   --log-group-name /aws/lambda/$ELOCUENCY_INFRA_PREFIXlanguage-agent \
#   --log-stream-name $ELOCUENCY_INFRA_PREFIXlanguage-agent