const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }`;

const replacementStr = `  let vite;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // Intercept /knowledge to inject Dynamic Open Graph tags for social media sharing
  app.get("/knowledge", async (req, res, next) => {
    const articleId = req.query.article;
    if (!articleId) {
      return next();
    }
    
    try {
      const response = await fetch(\`https://firestore.googleapis.com/v1/projects/the-family-legacy-roots/databases/(default)/documents/knowledge_articles/\${articleId}\`);
      if (!response.ok) {
         return next();
      }
      
      const data = await response.json();
      const fields = data.fields;
      if (!fields) return next();

      const title = fields.title?.stringValue || "سجل تراث العائلة";
      let description = fields.description?.stringValue || "منصة متخصصة في توثيق وحفظ سجلات تراث العائلة والأنساب بأعلى معايير الدقة والاحترافية.";
      description = description.replace(/<[^>]*>?/gm, '');

      const imageUrl = fields.coverImageUrl?.stringValue || "https://i.postimg.cc/d3PQr4fd/Banner.png";
      const url = \`https://thefamilylegacyroots.com/knowledge?article=\${articleId}\`;

      let html = "";
      if (process.env.NODE_ENV !== "production") {
          const fsPromises = await import("fs/promises");
          html = await fsPromises.readFile(path.join(process.cwd(), "index.html"), "utf-8");
          html = await vite.transformIndexHtml(req.originalUrl, html);
      } else {
          const fsPromises = await import("fs/promises");
          html = await fsPromises.readFile(path.join(process.cwd(), "dist", "index.html"), "utf-8");
      }

      // Remove existing og/twitter tags
      html = html.replace(/<meta property="og:[^>]*>/g, "");
      html = html.replace(/<meta (property|name)="twitter:[^>]*>/g, "");
      html = html.replace(/<title>.*<\\/title>/g, \`<title>\${title}<\\/title>\`);

      const ogTags = \`
        <meta property="og:title" content="\${title.replace(/"/g, '&quot;')}" />
        <meta property="og:description" content="\${description.replace(/"/g, '&quot;')}" />
        <meta property="og:image" content="\${imageUrl}" />
        <meta property="og:url" content="\${url}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="\${title.replace(/"/g, '&quot;')}" />
        <meta name="twitter:description" content="\${description.replace(/"/g, '&quot;')}" />
        <meta name="twitter:image" content="\${imageUrl}" />
      \`;

      html = html.replace("</head>", \`\${ogTags}</head>\`);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      console.error("Error generating OG tags:", error);
      next();
    }
  });

  if (process.env.NODE_ENV !== "production") {
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('server.ts', code);
  console.log("Updated server.ts successfully");
} else {
  console.log("Could not find target string in server.ts");
}
