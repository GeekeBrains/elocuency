# Create and deploy bff lambda

buildName="elo-server"
projectPath="$ELOCUENCY_PATH/apps/back/elo-server"
autoVersion=$(date +"%y.%m.%d.%H.%M")
awsAccountId="123456789012"
envFile="$ELOCUENCY_PATH/apps/back/elo-server/.env"
subnet1=""
subnet2=""
securityGroup=""
logFile=$projectPath/logs/elo-server-deploy.log
nextEnvFile="$ELOCUENCY_PATH/Apps/Front/NextJs/.env"
build=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --build=*)
      BUILD="${1#*=}"
      if [[ "$BUILD" != "true" && "$BUILD" != "false" ]]; then
        echo "Error: --build must be true or false."
      fi
      shift 1
      ;;
    *)
      echo "Error: Argumento desconocido: $1"
      show_help
      ;;
  esac
done


echo "Date: $autoVersion" | tee -a > $logFile 
echo "PATH: $projectPath" | tee -a $logFile
echo "ENV FILE: $envFile" | tee -a $logFile

## Load .env file to vars
if [ -f "$envFile" ]; then
    set -a && source $envFile && set +a
else
    echo "⚠️  .env file not found at $envFile"
fi

## Build
if [ "$BUILD" = "true" ]; then
  (cd $ELOCUENCY_PATH && nx run $buildName:build:prod)

  ## Firm version
  sed -i '' "s/{ELOCUENCY_AUTO_VERSION}/$autoVersion/g" $projectPath/dist/main.js

  ## Zip
  # (cd $projectPath/ && zip -r $buildName.zip main.js)
fi


## Update lambda
# awslocal lambda update-function-code \
#   --function-name $ELOCUENCY_INFRA_PREFIX$buildName \
#   --zip-file fileb://$projectPath/$name.zip

## Create SQS queue
echo "create-role $ELOCUENCY_INFRA_PREFIX$buildName" | tee -a $logFile
awslocal sqs create-queue \
  --queue-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
  >> $logFile

## Get SQS queue URL
echo "sqs get-queue-url" | tee -a $logFile
sqsQueueUrl=$(awslocal sqs get-queue-url \
  --queue-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --query 'QueueUrl' \
  --output text) \
  >> $logFile

## Get SQS queue ARN
echo "sqs get-queue-attributes" | tee -a $logFile
sqsQueueArn=$(awslocal sqs get-queue-attributes \
  --queue-url $sqsQueueUrl \
  --attribute-name QueueArn \
  --query 'Attributes.QueueArn' \
  --output text) 
  >> $logFile

## Create lambda
echo "create-role $ELOCUENCY_INFRA_PREFIX$buildName" | tee -a $logFile
awslocal iam create-role \
  --role-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      },
      {
        "StatementId": "FunctionURLAllowPublicAccess",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "lambda:InvokeFunctionUrl",
        "Resource": "arn:aws:lambda:'$ELOCUENCY_INFRA_REGION':'$awsAccountId':function:'$ELOCUENCY_INFRA_PREFIX$buildName'",
        "Condition": {
          "StringEquals": {
            "lambda:FunctionUrlAuthType": "NONE"
          }
        }
      }
    ]
  }' \
  >> $logFile

echo "iam put-role-policy" | tee -a $logFile
awslocal iam put-role-policy \
  --role-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --policy-name CloudWatchLogsPolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource": "arn:aws:logs:*:*:*"
      }
    ]
  }' \
  >> $logFile

echo "iam put-role-policy" | tee -a $logFile
awslocal iam put-role-policy \
  --role-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --policy-name SQSPolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        "Resource": "'$sqsQueueArn'"
      }
    ]
  }' \
  >> $logFile

echo "iam attach-role-policy" | tee -a $logFile
awslocal iam attach-role-policy \
  --role-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
  >> $logFile

echo "iam attach-role-policy" | tee -a $logFile
awslocal iam attach-role-policy \
  --role-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole \
  >> $logFile

echo "logs create-log-group" | tee -a $logFile
awslocal logs create-log-group \
  --log-group-name /aws/lambda/$ELOCUENCY_INFRA_PREFIX$buildName \
  >> $logFile

echo "logs create-log-stream" | tee -a $logFile
awslocal logs create-log-stream \
  --log-group-name /aws/lambda/$ELOCUENCY_INFRA_PREFIX$buildName \
  --log-stream-name $ELOCUENCY_INFRA_PREFIX$buildName \
  >> $logFile

echo "create-function $ELOCUENCY_INFRA_PREFIX$buildName >> $projectPath" | tee -a $logFile
awslocal lambda create-function \
  --function-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --code S3Bucket="hot-reload",S3Key="$projectPath/dist" \
  --handler main.handler \
  --runtime nodejs20.x \
  --architectures arm64 \
  --role arn:awslocal:iam::$awsAccountId:role/$ELOCUENCY_INFRA_PREFIX$buildName \
  --timeout 520 \
  --memory-size 128 \
  --layers $layerArn \
  --environment Variables="{ \
      ELOCUENCY_INFRA=$ELOCUENCY_INFRA, \
      ELOCUENCY_INFRA_REGION=$ELOCUENCY_INFRA_REGION, \
      ELOCUENCY_INFRA_PREFIX=$ELOCUENCY_INFRA_PREFIX, \
      ELOCUENCY_ENV="docker", \
      OPEN_AI_API_KEY=$OPENAI_API_KEY, \
      AUTH_JWT_SECRET=$AUTH_JWT_SECRET, \
      MYSQL_URL=$MYSQL_URL, \
      FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID, \
      CORS_ENABLED_URL=$CORS_ENABLED_URL, \
      APP_PREFIX=$APP_PREFIX, \
      PUSH_NOTIFICATIONS_PRIVATE_VAPID=$PUSH_NOTIFICATIONS_PRIVATE_VAPID, \
      PUSH_NOTIFICATIONS_PUBLIC_VAPID=$PUSH_NOTIFICATIONS_PUBLIC_VAPID, \
    }" \
  --tags Key=environment,Value=$env \
  >> $logFile
  # --vpc-config "SubnetIds=$subnet1,$subnet2,SecurityGroupIds=$securityGroup" \
  # --zip-file fileb://$projectPath/$name.zip \

## Add SQS trigger to Lambda
echo "lambda create-event-source-mapping $ELOCUENCY_INFRA_PREFIX$buildName" | tee -a $logFile
awslocal lambda create-event-source-mapping \
  --function-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --batch-size 1 \
  --event-source-arn $sqsQueueArn \
  >> $logFile

# Bad messages 
echo "sqs create-queue $ELOCUENCY_INFRA_PREFIX$buildName-death" | tee -a $logFile
awslocal sqs create-queue \
  --queue-name $ELOCUENCY_INFRA_PREFIX$buildName-death \
  >> $logFile


echo "lambda update-function-configuration $ELOCUENCY_INFRA_PREFIX$buildName" | tee -a $logFile
awslocal lambda update-function-configuration \
  --function-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --dead-letter-config TargetArn=arn:awslocal:sqs:$ELOCUENCY_INFRA_REGION:$awsAccountId:$ELOCUENCY_INFRA_PREFIX$buildName-death \
  >> $logFile

echo "lambda create-function-url-config" | tee -a $logFile
# TODO: AllowOrigins en localstack no funciona el *
awslocal lambda create-function-url-config \
  --function-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --auth-type NONE \
  >> $logFile
  # --invoke-mode BUFFERED \
  # --cors '{
  #     "AllowOrigins": ["http://localhost:4200"],
  #     "AllowMethods": ["*"],
  #     "AllowHeaders": ["Content-Type", "Authorization", "accept" , "origin", "cache-control", "pragma", "user-agent"],
  #     "ExposeHeaders": ["X-Custom-Header"],
  #     "MaxAge": 3600,
  #     "AllowCredentials": true
  # }' \

# Extract FunctionUrl from the log file
functionUrl=$(perl -nle 'print $1 if /"FunctionUrl": "(.*?)"/' $logFile | sed 's/.$//')
echo $functionUrl >> $logFile
echo $nextEnvFile >> $logFile

# Update the NEXT_PUBLIC_BFF_URL in the .env file
sed -i '' "s|^NEXT_PUBLIC_BFF_URL=.*|NEXT_PUBLIC_BFF_URL=\"$functionUrl\"|" "$nextEnvFile"

echo "Restart Next!!! NEXT_PUBLIC_BFF_URL updated to $functionUrl in $nextEnvFile"

# Allow invoke the proxy lambda
# awslocal iam put-role-policy \
#   --role-name bff-elo-prod   \
#   --policy-name AllowInvokeProxyLambda \
#   --policy-document '{
#     "Version": "2012-10-17",
#     "Statement": [
#       {
#         "Effect": "Allow",
#         "Action": "lambda:InvokeFunction",
#         "Resource": "arn:aws:lambda:'$ELOCUENCY_INFRA_REGION':'$awsAccountId':function:'$ELOCUENCY_INFRA_PREFIX'-proxy-to-internet",
#       }
#     ]
#   }' \
#   >> $logFile

# Create VPC endpoint to allow to conect to another lambda outside the VPC of this lambda
# awslocal ec2 create-vpc-endpoint \
#   --vpc-id vpc-039b859507876d09c \ # VPC ID 
#   --service-name com.amazonaws.eu-west-1.lambda \
#   --vpc-endpoint-type Interface \
#   --subnet-ids subnet-<subnet-id-1> subnet-<subnet-id-2> \ # Subnet IDs
#   --security-group-ids sg-<security-group-id> \ # Security Group ID
#   >> $logFile

# Create VPC endpoint to allow to conect to dynamodb
# awslocal ec2 create-vpc-endpoint \
#   --vpc-id vpc-039b859507876d09c \
#   --service-name com.amazonaws.eu-west-1.dynamodb \
#   --vpc-endpoint-type Gateway \
#   --route-table-ids rtb-0123456789abcdef \
#   >> $logFile

