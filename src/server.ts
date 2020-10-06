import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  app.get("/filteredimage", async (req, res) => {
    const image_url = req.query.image_url;
    if (!image_url) {
      return res.status(403).send({ auth: false, message: 'Image url is required' });
    }
    let filteredpath = "";
    filteredpath = await filterImageFromURL(image_url);
    console.log("saving File " + filteredpath);
    if (filteredpath == "Error"){
      return res.status(403).send({ auth: false, message: 'Image url is not correct' });
    }

    res.sendFile(filteredpath, function () {
      console.log("removing file: " + filteredpath);
      try {
        deleteLocalFiles([filteredpath]);
        console.log("file Deleted: " + filteredpath);
      } catch (e) {
        console.log("error removing ", filteredpath);
      }
    });
  });

    // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}");
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();