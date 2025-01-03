# Create and deploy elo-bff node modules layer
 
cd /Users/joshua/my-docs/code/elocuency
mkdir -p dist/apps/layers/nodejs/node20/node_modules

rm -R dist/apps/layers/nodejs/node20/node_modules/*
rm -R dist/apps/layers/*.zip
cp -R apps/back/elo-bff/node_modules/* dist/apps/layers/nodejs/node20/node_modules

(cd dist/apps/layers && zip -r node-modules-elo-bff.zip nodejs)

aws s3 cp dist/apps/layers/node-modules-elo-bff.zip s3://elo-lambdas

aws lambda publish-layer-version \
    --layer-name "elo-bff-node-modules-layer" \
    --description "Elocuency BFF Node.js dependencies layer" \
    --zip-file "fileb://dist/apps/layers/node-modules-elo-bff.zip" \
    --compatible-runtimes nodejs20.x \
    --compatible-architectures arm64 \
    --region eu-west-1

