# Create and deploy elo-bff node modules layer
 
nodeModulesLayerPath="apps/devops/layers/node-modules-aws-sdk/base/nodejs/node20/node_modules"
layerName="aws-sdk-v2-layer-elo-prod"

cd /Users/joshua/my-docs/code/elocuency
mkdir -p .tmp/apps/layers/nodejs/node20/node_modules

rm -R .tmp/apps/layers/nodejs/node20/node_modules/*
rm -R .tmp/apps/layers/*.zip
cp -R $nodeModulesLayerPath/* .tmp/apps/layers/nodejs/node20/node_modules

(cd .tmp/apps/layers && zip -r $layerName.zip nodejs)

# aws s3 cp .tmp/apps/layers/$layerName.zip s3://elo-lambdas

aws lambda publish-layer-version \
    --layer-name "aws-sdk-v2-layer-elo-prod" \
    --description "Aws SDK v2 Node.js dependencies layer" \
    --zip-file "fileb://.tmp/apps/layers/$layerName.zip" \
    --compatible-runtimes nodejs20.x \
    --compatible-architectures arm64 \
    --region eu-west-1

