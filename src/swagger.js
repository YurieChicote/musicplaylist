import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerDocs = (app, port = 3000) => {
  // Get the base URL for Vercel
  const getBaseUrl = () => {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.VERCEL) {
      return `https://musicplaylist-seven.vercel.app`;
    }
    return `http://localhost:${port}`;
  };

  const baseUrl = getBaseUrl();

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
          url: baseUrl,
          description: process.env.VERCEL || process.env.VERCEL_URL ? "Production server" : "Development server"
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
  
  // Swagger UI setup for Vercel - handle both serve and setup
  const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Music Playlist API Documentation",
    customCssUrl: null, // Disable external CSS
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  };
  
  // Serve Swagger UI static files - separate middleware for Vercel compatibility
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(specs, swaggerUiOptions));
  
  // Handle trailing slash redirect
  app.get("/api-docs/", (req, res) => {
    res.redirect("/api-docs");
  });
  
  // Also serve the JSON spec directly
  app.get("/api-docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
  
  console.log(`Swagger docs available at ${baseUrl}/api-docs`);
};
