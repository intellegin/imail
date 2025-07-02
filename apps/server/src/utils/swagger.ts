import path from 'path';

import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const swaggerConfig = (app: Express, port: number): void => {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'imail API',
        version: '1.0.0',
        description: 'API documentation for imail',
      },
      servers: [{ url: `http://localhost:${port}/api` }],
      components: {
        securitySchemes: {
          oidc: {
            type: 'openIdConnect',
            openIdConnectUrl: `${process.env.AUTH0_ISSUER_BASE_URL}.well-known/openid_configuration`,
          },
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              username: { type: 'string' },
              name: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      security: [{ oidc: [] }],
    },
    apis: [path.join(__dirname, '../api/**/*.ts')],
  };

  const specs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
