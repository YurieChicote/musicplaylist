import express from "express";
import Song from "../models/Song.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/songs:
 *   get:
 *     summary: Get all songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: List of all songs
 */
router.get("/", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

/**
 * @swagger
 * /api/v1/songs/{id}:
 *   get:
 *     summary: Get a song by ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song found
 *       404:
 *         description: Song not found
 */
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

/**
 * @swagger
 * /api/v1/songs:
 *   post:
 *     summary: Add a new song
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       201:
 *         description: Song created
 */
router.post("/", async (req, res) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/songs/{id}:
 *   put:
 *     summary: Update a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       200:
 *         description: Song updated
 *       404:
 *         description: Song not found
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Song not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

/**
 * @swagger
 * /api/v1/songs/{id}:
 *   patch:
 *     summary: Partially update a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       200:
 *         description: Song partially updated
 *       404:
 *         description: Song not found
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,      // only updates fields sent
      { new: true }  // return updated object
    );
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(updatedSong);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/v1/songs/{id}:
 *   delete:
 *     summary: Delete a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song deleted
 *       404:
 *         description: Song not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Song.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Song not found" });
    res.json({ message: "Song deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

export default router;
