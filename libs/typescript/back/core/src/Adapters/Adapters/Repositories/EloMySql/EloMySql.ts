import { Injectable } from '@nestjs/common';
import { entityDecoratorSymbol, EntityParamsType } from 'elo/back/core/Shared';
import { Pool } from 'mysql2/promise';

@Injectable()
export class EloMySql {
  static async select<T>(params: {
    entity?: object;
    select: string;
    from: string;
    whereValues?: Partial<T>;
    where?: string;
    db: Pool;
  }): Promise<void> {
    console.log(params);
  }

  static async update<T>(params: {
    entity: object;
    setValues: Partial<T>;
    whereValues: Partial<T>;
    db: Pool;
  }): Promise<void> {
    // console.log('ºº ~ file: EloMySql.ts:15 ~ EloMySql ~ setValues:', {
    //   entity: params.entity,
    //   setValues: params.setValues,
    //   whereValues: params.whereValues,
    // });

    const entityMetadata: EntityParamsType = Reflect.getMetadata(
      entityDecoratorSymbol,
      params.entity
    );
    // const indexConfig: EntityIndexType =
    //   entityMetadata.indexes[params.indexName];

    const setConditions = Object.keys(params.setValues)
      .map((key) => `${key} = ?`)
      .join(', ');
    const setValues = Object.values(params.setValues).map((value) => {
      return value;
    });

    const whereConditions = Object.keys(params.whereValues)
      .map((key) => `${key} = ?`)
      .join(' AND ');
    const whereValues = Object.values(params.whereValues).map((value) => {
      return value;
    });

    const sql = `UPDATE ${entityMetadata.name} SET ${setConditions} WHERE ${whereConditions}`;
    const sqlValues = [...setValues, ...whereValues];
    try {
      console.log('SQL Query:', params.db.format(sql, sqlValues));
      await params.db.execute(sql, sqlValues);
    } catch (err) {
      throw new Error('Error updating userWord: ' + err);
    }
  }
}
