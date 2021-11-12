const appConfig = {
  infra: {
    rabbitMQ: {
      hostname: process.env.INFRA_RABBIT_MQ_AIS_DATA_HOST,
      protocol: process.env.INFRA_RABBIT_MQ_AIS_DATA_PROTOCOL,
      port: parseInt(process.env.INFRA_RABBIT_MQ_AIS_DATA_PORT + ''),
    },
    postgresql: {
      hostname: process.env.DATABASE_PG_HOST,
      port: parseInt(process.env.DATABASE_PG_PORT + ''),
      password: process.env.DATABASE_PG_PASSWORD,
      username: process.env.DATABASE_PG_USERNAME,
      database: process.env.DATABASE_PG_DATABASE_NAME,
    },
    mongodb: {
      hostname: process.env.MONGODB_HOST,
      port: parseInt(process.env.MONGODB_PORT + ''),
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD
    }
  },
};

export default appConfig;
