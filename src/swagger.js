import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerDocs = (app, port = 3000) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Music Playlist API",
        version: "1.0.0",
        description: "API for managing playlists and songs",
        contact: {
          name: "API Support"
        }
      },
      servers: [
        {
          url: process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : `http://localhost:${port}`,
          description: process.env.VERCEL_URL ? "Production server" : "Development server"
        }
      ],
      components: {
        schemas: {
          // Define the Playlist schema
          Playlist: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string", example: "My Favorite Songs" },
              description: { type: "string", example: "Best playlist ever" },
              songs: {
                type: "array",
                items: { $ref: "#/components/schemas/Song" }
              },
            }
          },
          // Define the Song schema
          Song: {
            type: "object",
            required: ["title", "artist"],
            properties: {
              title: { type: "string", example: "Never Say Never" },
              artist: { type: "string", example: "Justin Bieber" },
              duration: { type: "string", example: "3:45" }
            }
          }
        }
      }
    },
    apis: ["./src/routes/*.js"],
  };

  const specs = swaggerJsdoc(options);
  
  // Swagger UI setup for Vercel
  const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Music Playlist API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true
    }
  };
  
  // Setup Swagger UI routes
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  
  console.log(`Swagger docs available at /api-docs`);
};
