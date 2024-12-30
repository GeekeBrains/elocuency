# Create and deploy proxy.to-internet lambda

autoVersion=$(date +"%y.%m.%d.%H.%M")
env="local"
buildName="proxy-to-internet"
buildPath=".tmp/apps/$env/back/$buildName"
logFile=$ELOCUENCY_PATH/$buildPath/elo-server-deploy.log
awsAccountId=""
eloServerName="elo-server"

echo "PATH: $buildPath" > $logFile
echo "ENV FILE: $envFile" >> $logFile


## Build
nx run proxy-to-internet:build:prod

# Firm version
sed -i '' "s/{ELOCUENCY_AUTO_VERSION}/$autoVersion/g" $buildPath/main.js

# Zip
(cd $buildPath/ && zip -r $buildName.zip main.js)

# Update lambda
# aws lambda update-function-code \
#   --function-buildName $buildName-$env \
#   --zip-file fileb://$buildPath/$buildName.zip \

# exit 0 # --------------------------------------------

# Create lambda
echo "iam create-role" >> $logFile
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
      }
    ]
  }' \
  --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
  >> $logFile

echo "iam put-role-policy" >> $logFile
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
  --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
  >> $logFile

echo "logs create-log-group" >> $logFile
awslocal logs create-log-group \
  --log-group-name /aws/lambda/$ELOCUENCY_INFRA_PREFIX$buildName \
  --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
  >> $logFile

echo "lambda create-function" >> $logFile
awslocal lambda create-function \
  --function-name $ELOCUENCY_INFRA_PREFIX-$buildName \
  --runtime nodejs20.x \
  --code S3Bucket="hot-reload",S3Key="$PWD/$buildPath" \
  --architectures arm64 \
  --role arn:aws:iam::$awsAccountId:role/$buildName-lambda-$env  \
  --handler main.handler \
  --timeout 120 \
  --memory-size 128 \
  --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
  >> $logFile
  # --zip-file fileb://$buildPath/$buildName.zip \

echo "lambda add-permission" >> $logFile
awslocal lambda add-permission \
  --function-name $ELOCUENCY_INFRA_PREFIX$buildName \
  --statement-id AllowInvokeFromBFF \
  --action lambda:InvokeFunction \
  --principal $awsAccountId \
  --source-arn arn:aws:lambda:eu-west-1:$awsAccountId:function:$ELOCUENCY_INFRA_PREFIX$eloServerName \
  --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
  >> $logFile
