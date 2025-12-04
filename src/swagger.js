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
  
  // Serve the JSON spec first (needed for HTML page)
  app.get("/api-docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(specs);
  });
  
  // For Vercel: Serve HTML page with Swagger UI from CDN
  app.get("/api-docs", (req, res) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Music Playlist API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
    .swagger-ui .topbar {
      display: none;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "${baseUrl}/api-docs/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true
      });
    };
  </script>
</body>
</html>`;
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });
  
  // Handle trailing slash redirect
  app.get("/api-docs/", (req, res) => {
    res.redirect("/api-docs");
  });
  
  // Fallback: Try to use swagger-ui-express for local development
  if (!process.env.VERCEL && !process.env.VERCEL_URL) {
    const swaggerUiOptions = {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "Music Playlist API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true
      }
    };
    app.use("/api-docs", swaggerUi.serve);
    app.get("/api-docs", swaggerUi.setup(specs, swaggerUiOptions));
  }
  
  console.log(`Swagger docs available at ${baseUrl}/api-docs`);
};
