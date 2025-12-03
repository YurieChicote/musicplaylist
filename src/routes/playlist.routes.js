import express from "express";
import Playlist from "../models/Playlist.js";
import Song from "../models/Song.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/playlists:
 *   get:
 *     summary: Retrieve all playlists
 *     tags: [Playlists]
 *     responses:
 *       200:
 *         description: List of all playlists
 */
router.get("/", async (req, res) => {
  const playlists = await Playlist.find().populate("songs");
  res.json(playlists);
});

/**
 * @swagger
 * /api/v1/playlists/{id}:
 *   get:
 *     summary: Get a playlist by ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist found
 *       404:
 *         description: Playlist not found
 */
router.get("/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate("songs");
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    res.json(playlist);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

/**
 * @swagger
 * /api/v1/playlists:
 *   post:
 *     summary: Add a new playlist
 *     tags: [Playlists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Playlist created
 */
router.post("/", async (req, res) => {
  try {
    const playlist = await Playlist.create(req.body);
    res.status(201).json(playlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/playlists/{id}:
 *   put:
 *     summary: Update a playlist
 *     tags: [Playlists]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Playlist updated
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Playlist not found" });
    res.json(updated);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

/**
 * @swagger
 * /api/v1/playlists/{id}/songs:
 *   post:
 *     summary: Add a song to a playlist
 *     tags: [Playlists]
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
 *             type: object
 *             properties:
 *               songId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Song added to playlist
 *       404:
 *         description: Playlist or song not found
 */
router.post("/:id/songs", async (req, res) => {
  try {
    const { songId } = req.body;

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs.push(songId);
    await playlist.save();

    res.json(playlist);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

/**
 * @swagger
 * /api/v1/playlists/{id}/songs/{songId}:
 *   delete:
 *     summary: Remove a song from a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song removed
 *       404:
 *         description: Playlist or song not found
 */
router.delete("/:id/songs/:songId", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs = playlist.songs.filter(id => id.toString() !== req.params.songId);
    await playlist.save();

    res.json({ message: "Song removed" });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

/**
 * @swagger
 * /api/v1/playlists/{id}:
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted
 *       404:
 *         description: Playlist not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Playlist.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Playlist not found" });
    res.json({ message: "Playlist deleted" });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

export default router;
