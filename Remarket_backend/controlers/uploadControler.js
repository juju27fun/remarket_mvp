const multer = require('multer');
const mongoose = require('mongoose');

let bucket;

const initBucket = async () => {
  if (!bucket) {
    const conn = mongoose.connection;
    bucket = new GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
  }
};

const conn = mongoose.connection;
conn.once('open', () => {
  bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

// Configuration de Multer
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez JPEG ou PNG.'), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // limite à 5 MB
  }
});

// Fonction d'upload
exports.uploadImage = [
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send('Aucun fichier n\'a été uploadé.');
    }

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).send('Le fichier est trop volumineux. La taille maximale est de 5 MB.');
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype
    });

    uploadStream.end(req.file.buffer, () => {
      res.status(201).json({
        message: 'Fichier uploadé avec succès',
        fileId: uploadStream.id,
        filename: filename
      });
    });

    uploadStream.on('error', () => {
      res.status(500).json({ error: 'Erreur lors de l\'upload du fichier' });
    });
  }
];

exports.getImage = async (req, res) => {
  try {
    await initBucket();
    const files = await bucket.find({ filename: req.params.filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Aucun fichier n\'existe' });
    }

    const file = files[0];
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      res.set('Content-Type', file.contentType);
      const readstream = bucket.openDownloadStreamByName(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({ error: 'Ce n\'est pas une image' });
    }
  } catch (error) {
    console.error('Error in getImage:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'image' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await initBucket();
    const files = await bucket.find({ filename: req.params.filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Aucun fichier n\'existe' });
    }

    await bucket.delete(files[0]._id);
    res.status(200).json({ message: 'Fichier supprimé avec succès' });
  } catch (error) {
    console.error('Error in deleteImage:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
  }
};

exports.getImageById = async (req, res) => {
  try {
    await initBucket();
    const imageId = new mongoose.Types.ObjectId(req.params.id);
    const files = await bucket.find({ _id: imageId }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Aucun fichier n\'existe' });
    }

    const file = files[0];
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      res.set('Content-Type', file.contentType);
      const readstream = bucket.openDownloadStream(file._id);
      readstream.pipe(res);
    } else {
      res.status(404).json({ error: 'Ce n\'est pas une image' });
    }
  } catch (error) {
    console.error('Error in getImageById:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'image' });
  }
};