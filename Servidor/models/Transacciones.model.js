import { Model } from 'objection'
import Evento from './Evento.model.js';
import Usuario from './Usuario.model.js';

export default class Entrada extends Model {
  static get tableName() {
    return 'transacciones';
  }

  static get idColumn() {
    return 'codigo';
  }

  static relationMappings= () => ({
      evento: {
        relation: Model.BelongsToOneRelation,
        modelClass: Evento,
        join: {
          from: 'transacciones.id_evento',
          to: 'eventos.id_evento',
        },
      },
      usuario: {
        relation: Model.BelongsToOneRelation,
        modelClass: Usuario,
        join: {
          from: 'transacciones.id_usuario',
          to: 'usuarios.id',
        },
      },
  
  });
}


