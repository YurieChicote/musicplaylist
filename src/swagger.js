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
      },
      components: {
        schemas: {
          // Define the Playlist schema
          Playlist: {
            type: "object",
            required: ["name"], // You can adjust the required fields
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              songs: {
                type: "array",
                items: { $ref: "#/components/schemas/Song" } // Reference the Song schema
              },
            }
          },
          // Define the Song schema
          Song: {
            type: "object",
            required: ["title", "artist"], // Adjust required fields as needed
            properties: {
              title: { type: "string" },
              artist: { type: "string" },
              duration: { type: "string" },  // You can use string or number for duration
            }
          }
        }
      }
    },
    apis: ["./src/routes/*.js"], // <-- path to your routes
  };

  const specs = swaggerJsdoc(options);
  
  // Swagger UI setup for Vercel
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Music Playlist API Documentation"
  }));
  
  console.log(`Swagger docs available at /api-docs`);
};
