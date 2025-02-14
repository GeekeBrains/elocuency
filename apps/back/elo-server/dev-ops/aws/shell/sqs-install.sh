# Create and deploy bff lambda

autoVersion=$(date +"%y.%m.%d.%H.%M")
buildName="elo-server"
buildPath="dist/apps/$env/back/$buildName"
awsAccountId=""
envFile="/Apps/Back/Agents/EloLanguage/.env"
layerArn="arn:aws:lambda:$ELOCUENCY_INFRA_REGION:$awsAccountId:layer:elo-bff-node-modules-layer:9"
name="EloLanguageAgent"

echo "Build PATH: $buildPath"
echo "ENV FILE: $envFile"


awslocal sqs create-queue --queue-name $ELOCUENCY_INFRA_PREFIX$buildName-queue

# awslocal lambda create-event-source-mapping \
#     --function-name $ELOCUENCY_INFRA_PREFIX$buildName \
#     --batch-size 1 \
#     --event-source-arn arn:aws:sqs:$ELOCUENCY_INFRA_REGION:$awsAccountId:$ELOCUENCY_INFRA_PREFIX$buildName-queue 

# Remove message
# awslocal sqs receive-message 
#     --queue-url http://localhost:4566/000000000000/$ELOCUENCY_INFRA_PREFIX$buildName
#
# awslocal sqs delete-message 
#     --queue-url http://localhost:4566/000000000000/$ELOCUENCY_INFRA_PREFIX$buildName
#     --receipt-handle <ReceiptHandle>