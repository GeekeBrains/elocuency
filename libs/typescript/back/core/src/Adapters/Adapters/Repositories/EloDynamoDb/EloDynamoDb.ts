import { Injectable } from '@nestjs/common';
import {
  BatchGetItemCommand,
  BatchGetItemCommandInput,
  BatchGetItemCommandOutput,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';

import {
  EntityIndexType,
  EntityParamsType,
  entityDecoratorSymbol,
  getEnv,
} from 'elo/back/core/Shared';
import { getAwsConfig } from 'elo/back/core/Shared/getAwsConfig';

const awsConfig = getAwsConfig();
const clientDDb = new DynamoDBClient(awsConfig);
const docDDb = DynamoDBDocumentClient.from(clientDDb);

@Injectable()
export class EloDynamoDb {
  static objectsPrefix: string = getEnv().infraPrefix + getEnv().appPrefix;

  static async upsert<T>(targetEntity: any, dto: any): Promise<T> {
    // console.log('ººDDb upsert', { dto, target });
    const entityMetadata: EntityParamsType = Reflect.getMetadata(
      entityDecoratorSymbol,
      targetEntity
    );

    // console.log('ººDDb upsert', { entityMetadata });
    const params: PutCommandInput = {
      TableName: this.objectsPrefix + entityMetadata.name,
      Item: dto,
    };
    try {
      const result = await docDDb.send(new PutCommand(params));
      console.log('DynamoDB OK: Record upserted successfully:', result);
      return result as T;
    } catch (error) {
      console.log('DynamoDB PutCommandInput params:', params);
      throw new Error('EloDynamoDB.upsert: ' + error);
    }
  }

  static async insert<T>(targetEntity: any, dto: T): Promise<void> {
    const entityMetadata: EntityParamsType = Reflect.getMetadata(
      entityDecoratorSymbol,
      targetEntity
    );
    const primaryKeyFields = Object.values(entityMetadata.indexes).find(
      (index) => index.primaryKey === true
    )?.fields;
    console.log('nameEntity:', {
      entityMetadata,
      primaryKeyFields,
      ConditionExpression: `attribute_not_exists(${primaryKeyFields[0]})`,
    });
    const params: PutCommandInput = {
      TableName: this.objectsPrefix + entityMetadata.name,
      Item: dto,
      // TODO: Search index whith primaryKey=true and allow multiple pk fields
      ConditionExpression: `attribute_not_exists(${primaryKeyFields[0]})`, // Evita sobrescribir si la clave ya existe
    };

    try {
      const result = await docDDb.send(new PutCommand(params));
      // console.log('Record inserted successfully:', result);
      return;
    } catch (error) {
      throw new Error('EloDynamoDb.insert: ' + error);
    }
  }

  static async query<T>(
    targetEntity: any,
    indexName: string,
    partitionKeyValue: string | number,
    sortKeyValue?: string | number,
    params?: { limit?: number; reverse?: boolean }
  ): Promise<T[]> {
    // Obtener metadata de la entidad y la configuración del índice
    const entityMetadata: EntityParamsType = Reflect.getMetadata(
      entityDecoratorSymbol,
      targetEntity
    );
    const indexConfig: EntityIndexType = entityMetadata.indexes[indexName];

    // Preparar la expresión de condición de clave
    let keyConditionExpression = `#pk = :pkval`;
    const expressionAttributeNames = {
      '#pk': indexConfig.fields[0], // Clave de partición (partition key)
    };
    const expressionAttributeValues = {
      ':pkval': partitionKeyValue, // Valor de la clave de partición
    };

    // Si hay una clave de ordenación (sort key), agregarla a la consulta
    if (indexConfig.fields.length > 1 && sortKeyValue) {
      keyConditionExpression += ` AND #sk = :skval`;
      expressionAttributeNames['#sk'] = indexConfig.fields[1]; // Clave de ordenación
      expressionAttributeValues[':skval'] = sortKeyValue; // Valor de la clave de ordenación
    }

    // Construir los parámetros del comando de consulta
    const queryCommandInput: QueryCommandInput = {
      TableName: this.objectsPrefix + entityMetadata.name,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      IndexName: indexName,
      Limit: params?.limit,
      ScanIndexForward: !params?.reverse,
    };
    if (indexConfig.primaryKey) {
      delete queryCommandInput.IndexName;
    }

    try {
      // console.log('DynamoDB.query queryCommandInput:', queryCommandInput);
      const result: QueryCommandOutput = await docDDb.send(
        new QueryCommand(queryCommandInput)
      );
      // console.log('DynamoDB OK: Query executed successfully:', queryCommandInput, result);
      return result.Items as T[]; // Devolver los elementos encontrados
    } catch (error) {
      console.log('ERROR DynamoDB.query params', {
        awsConfig,
        indexName,
        partitionKeyValue,
        sortKeyValue,
        params,
        table: this.objectsPrefix + entityMetadata.name,
        indexConfig,
        queryCommandInput,
      });
      throw new Error('EloDynamoDB.query: ' + error);
    }
    console.log(
      'ºº ~ file: EloDynamoDb.ts:163 ~ EloDynamoDb ~ queryCommandInput:',
      queryCommandInput
    );
  }

  static async queryBatch<T>(
    tableName: string,
    keys: { [key: string]: object }[]
  ): Promise<T[]> {
    // Construir los parámetros del comando BatchGetItem
    const requestItems: { [key: string]: any } = {};
    requestItems[this.objectsPrefix + tableName] = {
      Keys: keys.map((key) => {
        const formattedKey: { [key: string]: any } = {};
        for (const k in key) {
          formattedKey[k] = { S: key[k] };
        }
        return formattedKey;
      }),
    };
    console.log(
      'ºº ~ file: EloDynamoDb.ts:166 ~ EloDynamoDb ~ requestItems:',
      requestItems
    );

    const batchGetItemInput: BatchGetItemCommandInput = {
      RequestItems: requestItems,
    };

    try {
      const result: BatchGetItemCommandOutput = await docDDb.send(
        new BatchGetItemCommand(batchGetItemInput)
      );
      // console.log('DynamoDB OK: BatchGetItem executed successfully:', result);
      return result.Responses?.[this.objectsPrefix + tableName] as T[]; // Devolver los elementos encontrados
    } catch (error) {
      console.log('DynamoDB.batchGetItems params', {
        tableName,
        keys,
      });
      console.error('DynamoDB.batchGetItems error', error);
      throw error;
    }
  }

  static async delete<T>(
    targetEntity: any,
    indexName: string,
    partitionKeyValue: any,
    sortKeyValue?: any
  ): Promise<T[]> {
    // Obtener metadata de la entidad y la configuración del índice
    const entityMetadata: EntityParamsType = Reflect.getMetadata(
      entityDecoratorSymbol,
      targetEntity
    );
    const indexConfig: EntityIndexType = entityMetadata.indexes[indexName];

    // Preparar la expresión de condición de clave
    let keyConditionExpression = `#pk = :pkval`;
    const expressionAttributeNames = {
      '#pk': indexConfig.fields[0], // Clave de partición (partition key)
    };
    const expressionAttributeValues = {
      ':pkval': partitionKeyValue, // Valor de la clave de partición
    };

    // Si hay una clave de ordenación (sort key), agregarla a la consulta
    if (indexConfig.fields.length > 1 && sortKeyValue) {
      keyConditionExpression += ` AND #sk = :skval`;
      expressionAttributeNames['#sk'] = indexConfig.fields[1]; // Clave de ordenación
      expressionAttributeValues[':skval'] = sortKeyValue; // Valor de la clave de ordenación
    }

    // Construir los parámetros del comando de consulta
    const params: QueryCommandInput = {
      TableName: this.objectsPrefix + entityMetadata.name,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    // console.log('DynamoDB query params:', params);

    try {
      const result: QueryCommandOutput = await docDDb.send(
        new QueryCommand(params)
      );
      // console.log('DynamoDB OK: Query executed successfully:', result);
      return result.Items as T[]; // Devolver los elementos encontrados
    } catch (error) {
      console.error('DynamoDB Error: querying records:', error);
      throw new Error('EloDynamoDB.delete: ' + error);
    }
  }

  static async update<T>(
    targetEntity: any,
    dto: any,
    indexName: string,
    keyValue: any,
    sortKeyValue?: any
  ): Promise<void> {
    // Obtener metadata de la entidad y configuración del índice
    const entityMetadata: EntityParamsType = Reflect.getMetadata(
      entityDecoratorSymbol,
      targetEntity
    );
    const indexConfig: EntityIndexType = entityMetadata.indexes[indexName];

    // Construir la clave (partitionKey y sortKey) para identificar el ítem
    let keyAux: any;
    if (indexConfig.fields.length > 1) {
      keyAux = {
        [indexConfig.fields[0]]: keyValue,
        [indexConfig.fields[1]]: sortKeyValue,
      };
    } else {
      keyAux = {
        [indexConfig.fields[0]]: keyValue,
      };
    }

    // Construir las expresiones de actualización
    let updateExpression = 'SET';
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    Object.keys(dto).forEach((field, index) => {
      if (!indexConfig.fields.includes(field)) {
        const attributeName = `#attr${index}`;
        const attributeValue = `:val${index}`;
        updateExpression += ` ${attributeName} = ${attributeValue},`;
        expressionAttributeNames[attributeName] = field;
        expressionAttributeValues[attributeValue] = (dto as any)[field];
      }
    });

    // Eliminar la coma final de la expresión de actualización
    updateExpression = updateExpression.slice(0, -1);

    // Definir los parámetros de la operación de actualización
    const params: UpdateCommandInput = {
      TableName: this.objectsPrefix + entityMetadata.name,
      Key: keyAux,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    try {
      const result: UpdateCommandOutput = await docDDb.send(
        new UpdateCommand(params)
      );
      // console.log('DynamoDB OK: Record updated successfully:', result);
    } catch (error) {
      console.log('DynamoDB update params:', params);
      throw new Error(
        'EloDynamoDB.update ' +
          error +
          ' ' +
          JSON.stringify({ dto, indexName, keyValue, sortKeyValue })
      );
    }
  }

  static async scan<T>(targetEntity: any): Promise<T[]> {
    // Obtener la metadata de la entidad
    const entityMetadata: EntityParamsType = Reflect.getMetadata(
      entityDecoratorSymbol,
      targetEntity
    );

    // Definir los parámetros para el escaneo de la tabla
    const params: ScanCommandInput = {
      TableName: this.objectsPrefix + entityMetadata.name,
    };

    // console.log('DynamoDB scan params:', params);

    try {
      let result: ScanCommandOutput;
      let items: T[] = [];
      let lastEvaluatedKey: any = null;

      // Escanear la tabla de manera paginada si es necesario
      do {
        result = await docDDb.send(
          new ScanCommand({
            ...params,
            ExclusiveStartKey: lastEvaluatedKey,
          })
        );

        console.log('DynamoDB Scan result:', result);

        // Agregar los elementos al array de resultados
        if (result.Items) {
          items = [...items, ...(result.Items as T[])];
        }

        // Actualizar el último "lastEvaluatedKey" para continuar escaneando si hay más páginas
        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey); // Continuar mientras haya más páginas de resultados

      // console.log('DynamoDB OK: Full scan completed:', items);
      return items; // Devolver todos los elementos
    } catch (error) {
      throw new Error('EloDynamoDB.scan: ' + error);
    }
  }
}
