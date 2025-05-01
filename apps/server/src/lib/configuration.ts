export interface Configuration {
  server: ServerConfiguration;
  account: AccountConfiguration;
  user: UserConfiguration;
  postgres: PostgresConfiguration;
  redis: RedisConfiguration;
  avatarS3: S3Configuration;
  fileS3: S3Configuration;
  smtp: SmtpConfiguration;
  ai: AiConfiguration;
}

export type ServerMode = 'standalone' | 'cluster';

export interface ServerConfiguration {
  name: string;
  avatar: string;
  mode: ServerMode;
}

export type AccountVerificationType = 'automatic' | 'manual' | 'email';
export interface AccountConfiguration {
  verificationType: AccountVerificationType;
  otpTimeout: number;
  allowGoogleLogin: boolean;
}

export interface UserConfiguration {
  storageLimit: bigint;
  maxFileSize: bigint;
}

export interface PostgresConfiguration {
  url: string;
  ssl: {
    rejectUnauthorized?: boolean;
    ca?: string;
    key?: string;
    cert?: string;
  };
}

export interface RedisConfiguration {
  url: string;
  db: number;
  jobs: {
    prefix: string;
    name: string;
  };
  eventsChannel: string;
}

export interface S3Configuration {
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  region: string;
}

export interface SmtpConfiguration {
  host: string;
  port: number;
  user: string;
  password: string;
  from: {
    email: string;
    name: string;
  };
}

export type AiProvider = 'openai' | 'google';

export interface AiProviderConfiguration {
  apiKey: string;
  enabled?: boolean;
}

export interface AiModelConfiguration {
  provider: AiProvider;
  modelName: string;
  temperature: number;
}

export interface AiConfiguration {
  enabled: boolean;
  nodeEmbeddingDelay: number;
  documentEmbeddingDelay: number;
  providers: {
    openai: AiProviderConfiguration;
    google: AiProviderConfiguration;
  };
  langfuse: {
    enabled: boolean;
    publicKey: string;
    secretKey: string;
    baseUrl: string;
  };
  models: {
    queryRewrite: AiModelConfiguration;
    response: AiModelConfiguration;
    rerank: AiModelConfiguration;
    summarization: AiModelConfiguration;
    contextEnhancer: AiModelConfiguration;
    noContext: AiModelConfiguration;
    intentRecognition: AiModelConfiguration;
    databaseFilter: AiModelConfiguration;
    reasoning: AiModelConfiguration;
    deepPlanner: AiModelConfiguration;
    deepCritic: AiModelConfiguration;
    deepRerank: AiModelConfiguration;
  };
  embedding: {
    provider: AiProvider;
    apiKey: string;
    modelName: string;
    dimensions: number;
    batchSize: number;
  };
  chunking: ChunkingConfiguration;
  retrieval: RetrievalConfiguration;
  deepSearch?: {
    enabled: boolean;
    maxIterations: number;
  };
}

export interface ChunkingConfiguration {
  defaultChunkSize: number;
  defaultOverlap: number;
  enhanceWithContext: boolean;
}

export interface RetrievalConfiguration {
  hybridSearch: {
    semanticSearchWeight: number;
    keywordSearchWeight: number;
    maxResults: number;
  };
}

const getRequiredEnv = (env: string): string => {
  const value = process.env[env];
  if (!value) {
    throw new Error(`${env} is not set`);
  }

  return value;
};

const getOptionalEnv = (env: string): string | undefined => {
  return process.env[env];
};

export const configuration: Configuration = {
  server: {
    name: getRequiredEnv('SERVER_NAME'),
    avatar: getOptionalEnv('SERVER_AVATAR') || '',
    mode: (getOptionalEnv('SERVER_MODE') as ServerMode) || 'standalone',
  },
  account: {
    verificationType:
      (getOptionalEnv(
        'ACCOUNT_VERIFICATION_TYPE'
      ) as AccountVerificationType) || 'manual',
    otpTimeout: parseInt(getOptionalEnv('ACCOUNT_OTP_TIMEOUT') || '600'),
    allowGoogleLogin: getOptionalEnv('ACCOUNT_ALLOW_GOOGLE_LOGIN') === 'true',
  },
  user: {
    storageLimit: BigInt(getOptionalEnv('USER_STORAGE_LIMIT') || '10737418240'),
    maxFileSize: BigInt(getOptionalEnv('USER_MAX_FILE_SIZE') || '104857600'),
  },
  postgres: {
    url: getRequiredEnv('POSTGRES_URL'),
    ssl: {
      rejectUnauthorized:
        getOptionalEnv('POSTGRES_SSL_REJECT_UNAUTHORIZED') === undefined
          ? undefined
          : getOptionalEnv('POSTGRES_SSL_REJECT_UNAUTHORIZED') === 'true',
      ca: getOptionalEnv('POSTGRES_SSL_CA'),
      key: getOptionalEnv('POSTGRES_SSL_KEY'),
      cert: getOptionalEnv('POSTGRES_SSL_CERT'),
    },
  },
  redis: {
    url: getRequiredEnv('REDIS_URL'),
    db: parseInt(getOptionalEnv('REDIS_DB') || '0'),
    jobs: {
      name: getOptionalEnv('REDIS_JOBS_QUEUE_NAME') || 'jobs',
      prefix: getOptionalEnv('REDIS_JOBS_QUEUE_PREFIX') || 'colanode',
    },
    eventsChannel: getOptionalEnv('REDIS_EVENTS_CHANNEL') || 'events',
  },
  avatarS3: {
    endpoint: getRequiredEnv('S3_AVATARS_ENDPOINT'),
    accessKey: getRequiredEnv('S3_AVATARS_ACCESS_KEY'),
    secretKey: getRequiredEnv('S3_AVATARS_SECRET_KEY'),
    bucketName: getRequiredEnv('S3_AVATARS_BUCKET_NAME'),
    region: getRequiredEnv('S3_AVATARS_REGION'),
  },
  fileS3: {
    endpoint: getRequiredEnv('S3_FILES_ENDPOINT'),
    accessKey: getRequiredEnv('S3_FILES_ACCESS_KEY'),
    secretKey: getRequiredEnv('S3_FILES_SECRET_KEY'),
    bucketName: getRequiredEnv('S3_FILES_BUCKET_NAME'),
    region: getRequiredEnv('S3_FILES_REGION'),
  },
  smtp: {
    host: getOptionalEnv('SMTP_HOST') || '',
    port: parseInt(getOptionalEnv('SMTP_PORT') || '587'),
    user: getOptionalEnv('SMTP_USER') || '',
    password: getOptionalEnv('SMTP_PASSWORD') || '',
    from: {
      email: getRequiredEnv('SMTP_EMAIL_FROM'),
      name: getRequiredEnv('SMTP_EMAIL_FROM_NAME'),
    },
  },
  ai: {
    enabled: getOptionalEnv('AI_ENABLED') === 'true',
    nodeEmbeddingDelay: parseInt(
      getOptionalEnv('AI_NODE_EMBEDDING_DELAY') || '5000'
    ),
    documentEmbeddingDelay: parseInt(
      getOptionalEnv('AI_DOCUMENT_EMBEDDING_DELAY') || '10000'
    ),
    providers: {
      openai: {
        apiKey: getOptionalEnv('OPENAI_API_KEY') || '',
        enabled: getOptionalEnv('OPENAI_ENABLED') === 'true',
      },
      google: {
        apiKey: getOptionalEnv('GOOGLE_API_KEY') || '',
        enabled: getOptionalEnv('GOOGLE_ENABLED') === 'true',
      },
    },
    langfuse: {
      enabled: getOptionalEnv('LANGFUSE_ENABLED') === 'true',
      publicKey: getOptionalEnv('LANGFUSE_PUBLIC_KEY') || '',
      secretKey: getOptionalEnv('LANGFUSE_SECRET_KEY') || '',
      baseUrl:
        getOptionalEnv('LANGFUSE_BASE_URL') || 'https://cloud.langfuse.com',
    },
    models: {
      queryRewrite: {
        provider: (getOptionalEnv('QUERY_REWRITE_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('QUERY_REWRITE_MODEL') || 'gpt-4o-mini',
        temperature: parseFloat(
          getOptionalEnv('QUERY_REWRITE_TEMPERATURE') || '0.3'
        ),
      },
      response: {
        provider: (getOptionalEnv('RESPONSE_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('RESPONSE_MODEL') || 'gpt-4o-mini',
        temperature: parseFloat(
          getOptionalEnv('RESPONSE_TEMPERATURE') || '0.3'
        ),
      },
      rerank: {
        provider: (getOptionalEnv('RERANK_PROVIDER') || 'openai') as AiProvider,
        modelName: getOptionalEnv('RERANK_MODEL') || 'gpt-4o-mini',
        temperature: parseFloat(getOptionalEnv('RERANK_TEMPERATURE') || '0.1'),
      },
      summarization: {
        provider: (getOptionalEnv('SUMMARIZATION_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('SUMMARIZATION_MODEL') || 'gpt-4o-mini',
        temperature: parseFloat(
          getOptionalEnv('SUMMARIZATION_TEMPERATURE') || '0.2'
        ),
      },
      contextEnhancer: {
        provider: (getOptionalEnv('CHUNK_CONTEXT_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('CHUNK_CONTEXT_MODEL') || 'gpt-4o-mini',
        temperature: parseFloat(
          getOptionalEnv('CHUNK_CONTEXT_TEMPERATURE') || '0.2'
        ),
      },
      noContext: {
        provider: (getOptionalEnv('NO_CONTEXT_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('NO_CONTEXT_MODEL') || 'gpt-4o-mini',
        temperature: parseFloat(
          getOptionalEnv('NO_CONTEXT_TEMPERATURE') || '0.5'
        ),
      },
      intentRecognition: {
        provider: (getOptionalEnv('INTENT_RECOGNITION_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('INTENT_RECOGNITION_MODEL') || 'gpt-4o-mini',
        temperature: parseFloat(
          getOptionalEnv('INTENT_RECOGNITION_TEMPERATURE') || '0.0'
        ),
      },
      databaseFilter: {
        provider: (getOptionalEnv('DATABASE_FILTER_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('DATABASE_FILTER_MODEL') || 'gpt-4o-mini',
        temperature: parseFloat(
          getOptionalEnv('DATABASE_FILTER_TEMPERATURE') || '0.0'
        ),
      },
      reasoning: {
        provider: (getOptionalEnv('REASONING_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('REASONING_MODEL') || 'gpt-4o',
        temperature: parseFloat(
          getOptionalEnv('REASONING_TEMPERATURE') || '0.3'
        ),
      },
      deepPlanner: {
        provider: (getOptionalEnv('DEEP_PLANNER_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('DEEP_PLANNER_MODEL') || 'o3',
        temperature: parseFloat(
          getOptionalEnv('DEEP_PLANNER_TEMPERATURE') || '0.3'
        ),
      },
      deepCritic: {
        provider: (getOptionalEnv('DEEP_CRITIC_PROVIDER') ||
          'openai') as AiProvider,
        modelName: getOptionalEnv('DEEP_CRITIC_MODEL') || 'o3',
        temperature: parseFloat(
          getOptionalEnv('DEEP_CRITIC_TEMPERATURE') || '0.0'
        ),
      },
      deepRerank: {
        provider: (getOptionalEnv('DEEP_RERANK_PROVIDER') ||
          'google') as AiProvider,
        modelName: getOptionalEnv('DEEP_RERANK_MODEL') || 'gemini-2.5-pro',
        temperature: parseFloat(
          getOptionalEnv('DEEP_RERANK_TEMPERATURE') || '0.2'
        ),
      },
    },
    embedding: {
      provider: (getOptionalEnv('EMBEDDING_PROVIDER') ||
        'openai') as AiProvider,
      modelName: getOptionalEnv('EMBEDDING_MODEL') || 'text-embedding-3-large',
      dimensions: parseInt(getOptionalEnv('EMBEDDING_DIMENSIONS') || '2000'),
      apiKey: getOptionalEnv('EMBEDDING_API_KEY') || '',
      batchSize: parseInt(getOptionalEnv('EMBEDDING_BATCH_SIZE') || '50'),
    },
    chunking: {
      defaultChunkSize: parseInt(
        getOptionalEnv('CHUNK_DEFAULT_CHUNK_SIZE') || '1000'
      ),
      defaultOverlap: parseInt(
        getOptionalEnv('CHUNK_DEFAULT_OVERLAP') || '200'
      ),
      enhanceWithContext:
        getOptionalEnv('CHUNK_ENHANCE_WITH_CONTEXT') === 'true',
    },
    retrieval: {
      hybridSearch: {
        semanticSearchWeight: parseFloat(
          getOptionalEnv('RETRIEVAL_HYBRID_SEARCH_SEMANTIC_WEIGHT') || '0.7'
        ),
        keywordSearchWeight: parseFloat(
          getOptionalEnv('RETRIEVAL_HYBRID_SEARCH_KEYWORD_WEIGHT') || '0.3'
        ),
        maxResults: parseInt(
          getOptionalEnv('RETRIEVAL_HYBRID_SEARCH_MAX_RESULTS') || '20'
        ),
      },
    },
    deepSearch: {
      enabled: getOptionalEnv('DEEP_SEARCH_ENABLED') === 'true',
      maxIterations: parseInt(
        getOptionalEnv('DEEP_SEARCH_MAX_ITERATIONS') || '3'
      ),
    },
  },
};
