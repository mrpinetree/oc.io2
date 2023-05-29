import { Model } from 'objection'
import Usuario from './Usuario.model.js';

export default class Evento extends Model {
  static get tableName() {
    return 'eventos';
  }

  static get idColumn() {
    return 'id_evento';
  }

  static relationMappings= () =>({
    empresa: {
      relation: Model.BelongsToOneRelation,
      modelClass: Usuario,
      join: {
        from: 'eventos.id_empresa',
        to: 'usuarios.id'
      }
    }
  
  });
}