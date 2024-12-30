# Create and deploy elo-bff node modules layer
 
cd /Users/joshua/my-docs/code/elocuency
mkdir -p .tmp/apps/layers/nodejs/node20/node_modules

rm -R .tmp/apps/layers/nodejs/node20/node_modules/*
rm -R .tmp/apps/layers/*.zip
cp -R apps/back/elo-bff/node_modules/* .tmp/apps/layers/nodejs/node20/node_modules

(cd .tmp/apps/layers && zip -r node-modules-elo-bff.zip nodejs)

aws s3 cp .tmp/apps/layers/node-modules-elo-bff.zip s3://elo-lambdas

aws lambda publish-layer-version \
    --layer-name "elo-bff-node-modules-layer" \
    --description "Elocuency BFF Node.js dependencies layer" \
    --zip-file "fileb://.tmp/apps/layers/node-modules-elo-bff.zip" \
    --compatible-runtimes nodejs20.x \
    --compatible-architectures arm64 \
    --region eu-west-1

