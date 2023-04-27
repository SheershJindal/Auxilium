import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  node_env: process.env.NODE_ENV || 'development',
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  emails: {
    sender: process.env.AZURE_EMAIL_SENDER,
    azure_connection_string: process.env.AZURE_EMAIL_CONNECTION_STRING,
  },

  storage: {
    azure_connection_string: process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING,
  },

  search: {
    algolia_application_id: process.env.ALGOLIA_APPLICATION_ID,
    algolia_admin_api_key: process.env.ALGOLIA_ADMIN_API_KEY,
    communitiesIndex: 'dev_COMMUNITIES',
    postsIndex: 'dev_POSTS',
    commentsIndex: 'dev_COMMENTS',
  },

  kafka: {
    clientId: 'dev',
    brokers: ['localhost:9092'],
    consumerGroupId: 'development',
    search_index_topic: "search_index"
  },
};
