import { Model } from 'objection';
import bcrypt from 'bcryptjs';
import Transacciones from './Transacciones.model.js';
import Evento from './Evento.model.js';

export default class Usuario extends Model {
  static tableName = 'usuarios';

  static idColumn = 'id';

  static jsonSchema = {
    type: 'object',
    required: ['email'],

    properties: {
      email: {type: 'string', default:''},
      password: {type: 'string'}
    }
  };

  set unsecurePassword (unsecurePassword) {
    this.password = bcrypt.hashSync(unsecurePassword, bcrypt.genSaltSync(10))
  };

  verifyPassword (unsecurePassword, callback) {
    return bcrypt.compare(String(unsecurePassword), String(this.password), callback)
  };

  static relationMappings=() =>({
      entrada: {
        relation: Model.HasManyRelation,
        modelClass: Transacciones,
        join: {
          from: 'usuarios.id',
          to: 'transacciones.id_usuario',
        },
      }, 
      eventos: {
        relation: Model.HasManyRelation,
        modelClass: Evento,
        join: {
          from: 'usuarios.id',
          to: 'eventos.id_empresa'
        }
      }
  });
}

