import express, { Router } from "express"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerModelValidator from "swagger-model-validator";
import swaggerUi from "swagger-ui-express"

// import * as swaggerDocument from './swagger.config.js';

const router = Router()

const swaggerOptions = {
    swaggerDefinition: {
        myapi: '3.0.0',
        info: {
            title: 'Playtube ',
            version: '1.0.0',
            description: 'API documentation for Playtube app which is a video streaming app',
        },
        tags: [
            {
                name: 'users',
                description: 'Users Api'
            }
        ],
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: 'development server'
            },
        ],
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT key authorization for api'
                },
                //this below may not work to do later
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: "header",
                    name: 'x-ap-key',
                    description: 'API key authorization for api'
                }
            }
        },
        security: {
            bearerAuth: []
        },
    },
    apis: ['./routes/*.js'], // files containing annotations as above
};


const swaggerDocument = {
    "openapi": "3.0.0",
    "info": {
        "title": "User Registration API",
        "version": "1.0.0"
    },
    "paths": {
        "/api/v1/users/register": {
            "post": {
                "tags": ["register"],
                "summary": "Register a new user",
                "security": [
                    { "ApiKeyAuth": [] },
                    { "bearerAuth": [] }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "required": ["username", "email", "fullname", "password", "avatar"],
                                "properties": {
                                    "username": {
                                        "type": "string",
                                        "example": "john_doe"
                                    },
                                    "email": {
                                        "type": "string",
                                        "example": "john@example.com"
                                    },
                                    "fullname": {
                                        "type": "string",
                                        "example": "John Doe"
                                    },
                                    "password": {
                                        "type": "string",
                                        "example": "P@ssw0rd123"
                                    },
                                    "avatar": {
                                        "type": "string",
                                        "format": "binary"
                                    },
                                    "coverImage": {
                                        "type": "string",
                                        "format": "binary"
                                    }
                                }
                            }
                        }
                    }
                }
                ,
                "responses": {
                    "201": { "description": "User registered successfully" },
                    "400": { "description": "Bad Request" },
                    "409": { "description": "Conflict - User already exists" },
                    "500": { "description": "Internal Server Error" }
                }
            }
        }
    },
    "components": {
        "securitySchemes": {
            "ApiKeyAuth": {
                "type": "apiKey",
                "in": "header",
                "name": "x-api-key"
            },
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    }
};


const swaggerSpec = swaggerJSDoc(swaggerOptions)
swaggerModelValidator(swaggerSpec)

router.get('/json', (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.send(swaggerSpec)
})
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export default router