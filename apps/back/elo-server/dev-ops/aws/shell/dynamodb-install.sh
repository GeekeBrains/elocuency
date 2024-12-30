autoVersion=$(date +"%y.%m.%d.%H.%M")
awsAccountId=""
buildName="elo-server"
projectPath="$ELOCUENCY_PATH/apps/back/elo-server"
logFile=$projectPath/dynamodb-install.log

echo "Date: $autoVersion" | tee -a > $logFile 
echo "PATH: $buildPath" | tee -a $logFile
echo "ENV FILE: $envFile" | tee -a $logFile

## Load .env file to vars without echo
set -a && source $projectPath/.env && set +a


echo "sqs ${ELOCUENCY_INFRA_PREFIX}topics" | tee -a $logFile
awslocal dynamodb create-table \
    --table-name ${ELOCUENCY_INFRA_PREFIX}topics \
    --attribute-definitions \
        AttributeName=topicId,AttributeType=S \
        AttributeName=parentTopicId,AttributeType=S \
    --key-schema \
        AttributeName=topicId,KeyType=HASH \
    --global-secondary-indexes \
        '[
            {
                "IndexName": "parentTopicId",
                "KeySchema": [
                    {"AttributeName":"parentTopicId","KeyType":"HASH"}
                ],
                "Projection": {
                    "ProjectionType":"ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                }
            }
        ]' \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
    >> $logFile


echo "sqs ${ELOCUENCY_INFRA_PREFIX}chats" | tee -a $logFile
awslocal dynamodb create-table \
    --table-name ${ELOCUENCY_INFRA_PREFIX}chats \
    --attribute-definitions \
        AttributeName=chatId,AttributeType=S \
    --key-schema \
        AttributeName=chatId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1  \
    --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
    >> $logFile


echo "sqs ${ELOCUENCY_INFRA_PREFIX}chats-msgs" | tee -a $logFile
awslocal dynamodb create-table \
    --table-name ${ELOCUENCY_INFRA_PREFIX}chats-msgs \
    --attribute-definitions \
        AttributeName=chatId,AttributeType=S \
        AttributeName=utc,AttributeType=S \
        AttributeName=parentTopicId,AttributeType=S \
    --key-schema \
        AttributeName=chatId,KeyType=HASH \
        AttributeName=utc,KeyType=RANGE \
    --global-secondary-indexes \
        '[
            {
                "IndexName": "parentTopicId",
                "KeySchema": [
                    {"AttributeName":"parentTopicId","KeyType":"HASH"}
                ],
                "Projection": {
                    "ProjectionType":"ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                }
            }
        ]' \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
    >> $logFile


echo "sqs ${ELOCUENCY_INFRA_PREFIX}chats-users" | tee -a $logFile
awslocal dynamodb create-table \
    --table-name ${ELOCUENCY_INFRA_PREFIX}chats-users \
    --attribute-definitions \
        AttributeName=chatId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=chatId,KeyType=HASH \
        AttributeName=userId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
        '[
            {
                "IndexName": "userId",
                "KeySchema": [
                    {"AttributeName":"userId","KeyType":"HASH"}
                ],
                "Projection":{
                    "ProjectionType":"ALL"
                }
            }
        ]' \
    --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
    >> $logFile


echo "sqs ${ELOCUENCY_INFRA_PREFIX}users" | tee -a $logFile
awslocal dynamodb create-table \
    --table-name ${ELOCUENCY_INFRA_PREFIX}users \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --global-secondary-indexes \
        '[
            {
                "IndexName": "email",
                "KeySchema": [
                    {"AttributeName":"email","KeyType":"HASH"}
                ],
                "Projection": {
                    "ProjectionType":"ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                }
            }
        ]' \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --tags Key=environment,Value=$ELOCUENCY_INFRA_PREFIX \
    >> $logFile


echo "Adding user to ${ELOCUENCY_INFRA_PREFIX}users" | tee -a $logFile
awslocal dynamodb put-item \
    --table-name ${ELOCUENCY_INFRA_PREFIX}users \
    --item \
        '{
            "userId": {
                "S": "bc7c7849-162e-4f1b-a912-4ea890c8063c"
            },
            "avatarUrl": {
                "S": "photo"
            },
            "createDate": {
                "S": "2024-05-14T08:12:13.545Z"
            },
            "currentChatId": {
                "S": "9e016bfa-6ab4-406f-bbf7-5aa70707732d"
            },
            "currentGameId": {
                "S": "589dd5de-c05f-49b5-8ef7-6971688523ab"
            },
            "email": {
                "S": "jesus.angel.carballo.santaclara@gmail.com"
            },
            "externalLoginProviderType": {
                "S": "google"
            },
            "flowName": {
                "S": ""
            },
            "level": {
                "N": "20"
            },
            "name": {
                "S": "Jesus Carballo"
            },
            "nativeLangId": {
                "S": "es"
            },
            "password": {
                "S": ""
            },
            "pushSubscriptionRaw": {
                "S": "{\n          \"endpoint\": \"https://fcm.googleapis.com/fcm/send/dBIpBW2M8BA:APA91bGHGFgRkB6_YvNuseZP-akzicWuZFJZIk4MqISoKnJ0MIdz6K8pmlh1_Df61MqSMi4utJkuXz9fOU7kuxqZCJ5ysBzGSohq9KfhWocoy6jBSmNSPdoSeIXQNQiAZKuMqkdinRzJ\",\n          \"keys\": {\n            \"p256dh\": \"BD-spGKfP6b-G38LXCpgbdvh-pn_clk3Aynog33VmBL13O7iepAOlxShaM_eRZrl3O2FwykieXr2E5M9pHTSi3w\",\n            \"auth\": \"CSIF1AROpaC0x0EbEyk2JQ\"\n          }\n        }"
            },
            "sessionToken": {
                "S": ""
            },
            "successWordsSpeakingGame": {
                "N": "0"
            },
            "successWordsWritingGame": {
                "N": "0"
            },
            "targetLangId": {
                "S": "en"
            },
            "totalWordsGame": {
                "N": "0"
            }
        }' \
    --return-consumed-capacity TOTAL \
    >> $logFile

echo "Adding user to ${ELOCUENCY_INFRA_PREFIX}users" | tee -a $logFile
awslocal dynamodb put-item \
    --table-name ${ELOCUENCY_INFRA_PREFIX}users \
    --item \
        '{
        "userId": {
            "S": "4409543d-4306-4c71-a0b2-4912c78451b9"
        },
        "email": {
            "S": "paquito@paquito.com"
        },
        "level": {
            "N": "0"
        },
        "name": {
            "S": "Paco"
        },
        "nativeLangId": {
            "S": "es"
        },
        "password": {
            "S": "$2a$10$pgIt9L3ku/Qilbmx5.ulNuTFUIq3JQTgerV0ImVvHssb4FWORi12i"
        },
        "pushSubscriptionRaw": {
            "S": "{\n          \"endpoint\": \"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABnJkujE3O-HhcbhEukdf-RaDWQDULqNLkU_7aSkmrvMiAZTPXTeSWylUO_ehlFeBMUjiNS1401tBzvM3ZBEPwAYEowhe9hFUxsnt2kMpblrAFn-ie6H7HZmvvWh-usY0-88-kQCjM-y9KdmmnJSIdYQbvMMWj_0iQAq39UwK_xSmwosZg\",\n          \"keys\": {\n            \"p256dh\": \"BI3WClMAGFdDU3YD4w__9YfjQn4Fx5OdE2xO6oWaqvQn4agXxzFLcUV9te_BxKoaXDNsXAfBIM7hV8BVy5RsDLo\",\n            \"auth\": \"UTE1ICkoj2CbIV07lH7UWw\"\n          }\n        }"
        },
        "successWordsSpeakingGame": {
            "N": "0"
        },
        "successWordsWritingGame": {
            "N": "0"
        },
        "targetLangId": {
            "S": "en"
        },
        "totalWordsGame": {
            "N": "0"
        }
    }' \
    --return-consumed-capacity TOTAL \
    >> $logFile


echo "Adding user to ${ELOCUENCY_INFRA_PREFIX}users" | tee -a $logFile
awslocal dynamodb put-item \
    --table-name ${ELOCUENCY_INFRA_PREFIX}users \
    --item \
        '{
        "userId": {
            "S": "A-language-teacher"
        },
        "email": {
            "S": "language-teacher@elocuency.com"
        },
        "level": {
            "N": "0"
        },
        "name": {
            "S": "Elo Language"
        },
        "nativeLangId": {
            "S": "es"
        },
        "password": {
            "S": "$2a$10$pgIt9L3ku/Qilbmx5.ulNuTFUIq3JQTgerV0ImVvHssb4FWORi12i"
        },
        "pushSubscriptionRaw": {
            "S": "{\n          \"endpoint\": \"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABnJkujE3O-HhcbhEukdf-RaDWQDULqNLkU_7aSkmrvMiAZTPXTeSWylUO_ehlFeBMUjiNS1401tBzvM3ZBEPwAYEowhe9hFUxsnt2kMpblrAFn-ie6H7HZmvvWh-usY0-88-kQCjM-y9KdmmnJSIdYQbvMMWj_0iQAq39UwK_xSmwosZg\",\n          \"keys\": {\n            \"p256dh\": \"BI3WClMAGFdDU3YD4w__9YfjQn4Fx5OdE2xO6oWaqvQn4agXxzFLcUV9te_BxKoaXDNsXAfBIM7hV8BVy5RsDLo\",\n            \"auth\": \"UTE1ICkoj2CbIV07lH7UWw\"\n          }\n        }"
        },
        "successWordsSpeakingGame": {
            "N": "0"
        },
        "successWordsWritingGame": {
            "N": "0"
        },
        "targetLangId": {
            "S": "en"
        },
        "totalWordsGame": {
            "N": "0"
        }
    }' \
    --return-consumed-capacity TOTAL \
    >> $logFile