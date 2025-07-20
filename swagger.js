const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Oxeir AI Resume Builder API',
      version: '1.0.0',
      description: 'API documentation for Oxeir AI Resume Builder',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      schemas: {
        CandidateProfile: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            location: { type: 'string' },
            skills: { type: 'array', items: { type: 'string' } },
            availability: { type: 'string', enum: ['immediate', '15days', '30days'] },
            completedCourses: { type: 'array', items: { type: 'string' } },
            experience: { type: 'number' },
            resumeUrl: { type: 'string' },
            resumeText: { type: 'string' },
            resumeKeywords: { type: 'array', items: { type: 'string' } },
            skillScore: { type: 'number' },
            isJobReady: { type: 'boolean' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['userId', 'name', 'email', 'skills', 'availability']
        }
      }
    }
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger; 