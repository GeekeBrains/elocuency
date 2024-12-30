import { EloProperty } from '../../../libs/src/entities';

export enum MyEntityFieldsEnum {
  acmeId = 'acmeId',
}

export enum MyEntityIndexesEnum {
  pk = 'pk',
}

@EloEntity({
  name: 'Acme',
  indexes: {
    [MyEntityIndexesEnum.pk]: {
      primaryKey: true,
      fields: [MyEntityFieldsEnum.acmeId],
    },
  },
})
export class AcmeEntity {
  constructor(dto?: Partial<AcmeEntity>) {
    Object.assign(this, dto);
  }

  @EloProperty({ isPrimaryKey: true })
  [MyEntityFieldsEnum.acmeId]: string = '';
}
