#!/bin/bash

# Criar a tabela DynamoDB "pedidos"
awslocal dynamodb create-table \
  --table-name pedidos \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Criar fila SQS "pedidos-cozinha"
awslocal sqs create-queue --queue-name pedidos-cozinha

# Criar bucket S3 "comprovantes-pedidos"
awslocal s3api create-bucket --bucket comprovantes-pedidos
