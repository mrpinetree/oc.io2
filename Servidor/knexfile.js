// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

export const development={
  client: 'pg',
  connection:{
    port: 5432,
    host: 'localhost',
    database: 'pruebaImagen',
    user : 'postgres',
    password: 'root',
  }
};