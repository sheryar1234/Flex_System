import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Enable CORS
import cors from 'cors';
app.use(cors());

// Connect to MongoDB
await mongoose.connect('mongodb://user1:user1@ac-ahudh1z-shard-00-00.lzkch3r.mongodb.net:27017,ac-ahudh1z-shard-00-01.lzkch3r.mongodb.net:27017,ac-ahudh1z-shard-00-02.lzkch3r.mongodb.net:27017/FLEX_DB?replicaSet=atlas-1zh0dp-shard-0&ssl=true&authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true });

// Create uploads directory if it doesn't exist
const uploadDirectory = join(__dirname, 'uploads');
if (!existsSync(uploadDirectory)) {
  mkdirSync(uploadDirectory);
}

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage });

// Define image schema and model
const imageSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  }
});
const Image = mongoose.model('Image', imageSchema);

// Route for uploading images
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { date } = req.body;
    const newImage = new Image({
      date,
      imagePath: req.file.path
    });
    await newImage.save();
    res.status(201).send('Image uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for fetching all images
app.get('/images', async (req, res) => {
    try {
      const images = await Image.find();
      res.json(images);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
