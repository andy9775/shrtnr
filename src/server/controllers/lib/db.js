import config from '../../../../config';

import knex from 'knex';

/**
 * Database connection object
 */
var db = new knex({
  client: 'postgres',
  connection: {
    host: config.databaseHost,
    user: config.postgresUsername,
    password: config.postgresPass,
    database: config.postgresDatabase
  },
  pool: {
    min: config.poolMin,
    max: config.poolMax
  },
  acquireConnectionTimeout: config.poolTimeout
});

/**
 * Specifies the schema of the Urls table
 *
 * Table:
 *  id |              long_url              | user_name
 * ----+------------------------------------+-----------
 *  1  | http://www.example.com             | nullable
 */
var urlsSpec = { tableName: 'urls' };

export {db, urlsSpec};
