# Create and deploy elo-bff node modules layer
 
nodeModulesLayerPath="apps/devops/layers/node-modules-aws-sdk/base/nodejs/node20/node_modules"
layerName="aws-sdk-v2-layer-elo-prod"

cd /Users/joshua/my-docs/code/elocuency
mkdir -p dist/apps/layers/nodejs/node20/node_modules

rm -R dist/apps/layers/nodejs/node20/node_modules/*
rm -R dist/apps/layers/*.zip
cp -R $nodeModulesLayerPath/* dist/apps/layers/nodejs/node20/node_modules

(cd dist/apps/layers && zip -r $layerName.zip nodejs)

# aws s3 cp dist/apps/layers/$layerName.zip s3://elo-lambdas

aws lambda publish-layer-version \
    --layer-name "aws-sdk-v2-layer-elo-prod" \
    --description "Aws SDK v2 Node.js dependencies layer" \
    --zip-file "fileb://dist/apps/layers/$layerName.zip" \
    --compatible-runtimes nodejs20.x \
    --compatible-architectures arm64 \
    --region eu-west-1

