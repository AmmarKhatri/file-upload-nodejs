const express = require('express');
const fileUpload = require('express-fileupload');
const AdmZip = require('adm-zip');
const { Buffer } = require('buffer');

const app = express();

// Enable file uploads
app.use(fileUpload({
  createParentPath: true
}));


app.post('/upload/:name', (req, res) => {
    // Check if a file was uploaded
      const name = req.params.name
      if (req.files) {
        console.log("Received file with name: ", name)
      } else {
        res.status(404).json({msg: "No files received"})
      }
    
      const file = req.files[name];
      if (req.files[name].mimetype !== 'application/zip') {
        console.log(req.files[name].mimetype, "File type")
        return res.status(400).json({ msg: 'Only zip files are allowed' });
      } else {
        console.log(req.files[name].data)
        // Load the zip file from a Buffer
        const zip = new AdmZip(new Buffer.from(req.files[name].data));
        // // Get an array of the file names inside the zip file
        const fileNames = zip.getEntries().map(entry => entry.entryName);
        if (fileNames.some(name => name.includes('docker-compose.yml')) && fileNames.some(name => name.includes('dockerfile'))) {
          // Both files are present, respond with success
          //********************* Store in S3 bucket here ********************* */
              // USE "file" variable on line 23 to upload it or if need buffer, use "req.files[name].data"
          // **********************************************************************
          res.status(200).json({
            msg: "Files uploaded successfully",
          })
        } else{
          res.status(400).json({msg: "Incorrect files. Please provide both docker-compose and dockerfile"})
        }
    }
  });
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
    