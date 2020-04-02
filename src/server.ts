import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles, isValidUrl } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    if (Object.keys(req.query).length != 0) {
      if ("image_url" in req.query && isValidUrl(req.query.image_url)) {
        let result = await filterImageFromURL(req.query.image_url).catch(e => {
          res.status(404).json({
            error: `Could  not fetch resource  <${req.query.image_url}>`
          });
        });
        res.sendFile(result);
      } else {
        res.status(400).json({
          error: `Bad request. Invalid Query Param. Invalid Query Value`
        });
      }
    } else {
      res.send("try GET /filteredimage?image_url={{}}");
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
