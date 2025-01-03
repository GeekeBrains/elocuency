. $ELOCUENCY_PATH/apps/back/elo-server/dev-ops/aws/shell/install.sh
. $ELOCUENCY_PATH/apps/back/agents/language-teacher/dev-ops/aws/shell/install.sh 

# awslocal lambda invoke --function-name $ELOCUENCY_INFRA_PREFIXelo-server out.txt && cat out.txt

# ln -s ../../elocuency/node_modules ../../dist/agents/language-teacher-agent

# awslocal lambda invoke --function-name $ELOCUENCY_INFRA_PREFIXelo-server elo-server.log && cat elo-server.log

# awslocal lambda invoke --function-name $ELOCUENCY_INFRA_PREFIXlanguage-teacher-agent $ELOCUENCY_INFRA_PREFIXlanguage-teacher-agent.log && cat $ELOCUENCY_INFRA_PREFIXlanguage-teacher-agent.log

# View logs
# awslocal logs tail /aws/lambda/$ELOCUENCY_INFRA_PREFIXlanguage-teacher-agent --follow