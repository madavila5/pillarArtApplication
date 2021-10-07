const router = require('express').Router();
const fs = require("fs");
const { Artwork, Artist } = require('../../models');
const upload = require("../../middleware/upload");

router.get('/', async (req, res) => {
    try {
      const artworkData = await Artwork.findAll({
      });
      res.status(200).json(artworkData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/imageUrls', async (req, res) => {
    try {
      const artworkNames = await Artwork.findAll({
        attributes: ['name'],
        raw: true
      });
      let imageUrls = {}
      for (let i = 0; i < artworkNames.length; i++) {
        let imageName = artworkNames[i].name;
        let filePath = '../public/tmp/'
        imageUrls[i] = filePath += imageName
      }
      res.status(200).json(imageUrls);
    } catch (err) {
      res.status(500).json(err);
    }
  })

  router.get('/:id', async (req, res) => {
    try {
      const artworkData = await Artwork.findByPk(req.params.id, {
        // include: [{ model: Artist }],
      });
  
      if (!artworkData) {
        res.status(404).json({ message: 'No artwork found with that id!' });
        return;
      }
  
      res.status(200).json(artworkData);
    } catch (err) {
      res.status(500).json(err);
    }
  })
// UPLOAD ROUTE

  router.post('/', upload.single("file"), async (req, res) => {
    try {
      console.log(req.file);
      console.log(req.body)
      if (req.file == undefined) {
        res.send(`You must select a file.`);
      }
      if (req.body == undefined) {
        res.send('you must include artwork information')
      }
  
      Artwork.create({
        type: req.file.mimetype,
        name: req.file.originalname,
        // title: req.body.title,
        data: fs.readFileSync(
          "C:/Users/krist/pillarArtApplication/public/uploads/" + req.file.filename
        ),
        // signature_data: fs.readFileSync(
        //   "C:/Users/krist/pillarArtApplication/public/uploads/" + req.file.filename
        // ),
        // artist: req.session.artist_id,
        
      }).then((artwork) => {
        fs.writeFileSync(
          "C:/Users/krist/pillarArtApplication/public/tmp/" + artwork.name,
          artwork.data
        );
  
        res.send(`File has been uploaded.`);
      });
    } catch (error) {
      console.log(error);
      res.send(`Error when trying upload images: ${error}`);
    }
  });

router.delete('/:id', async (req, res) => {
  try {
    const artworkData = await Artwork.destroy({
      where: {
        id: req.params.id,
        // artist_id: req.session.artist_id,
      },
    });

    if (!artworkData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(artworkData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
