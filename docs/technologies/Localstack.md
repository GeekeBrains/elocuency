# Localstack

It is a docker that allow to emulate the aws enviroment in local.

## Docs and install

https://github.com/localstack/localstack

## Usefull comands

```
# Start a localstack demon
> localstack start -d

# Show current config
> localstack config show
```

## SQS

You can use the aws command but you need to add the param:
or use awslocal:

```
--endpoint-url=http://localhost:4566

## Create queue
> aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name the-queueu-name

## Send Message
> aws --endpoint-url=http://localhost:4566 sqs send-message -queu-url http://locahost:4576/queue/cola1 --message-body "hello"

## Receive message
> aws --endpoint-url=http://localhost:4566 sqs receive-message --queue-url http://locahost:4576/queue/the-queueu-name

## Show active queuues
> aws --endpoint-url=http://localhost:4566 sqs list-queues

## If you have more than one profile on ~/.aws/credentials add: --profile "profile-name"

```

## Lambdas

S3Key Its the localpath. Inside this directory, localstack can not see symblink dirs.

awslocal lambda create-function \  
 --function-name elo-bff \  
 --runtime "nodejs18.x" \  
 --role arn:aws:iam::123456789012:role/lambda-ex \
 --code S3Bucket="hot-reload",S3Key="/Users/joshua/docs_locales/code/elocuency/apps/elo-server/dist" \
 --handler main.handler

awslocal lambda update-function-configuration \
 --function-name elo-bff \
 --environment "Variables={MYSQL_URL='mysql://admin:@',AUTH_JWT_SECRET='',FIREBASE_PROJECT_ID='elocuency-e6a90',NEST_DEBUG=true,CORS_ENABLED_URL='http://localhost:4200',SERVER_PORT=3000,OPENAI_API_KEY=pp}"

awslocal lambda invoke \
 --function-name elo-bff \
 --payload '{"hello":"asd"}' elo-bff.lambda.log

## Logs

awslocal logs describe-log-groups

awslocal logs create-log-group --log-group-name /aws/lambda/elo-bff

awslocal logs describe-log-streams --log-group-name /aws/lambda/elo-bff
