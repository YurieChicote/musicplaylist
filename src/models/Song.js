import mongoose from "mongoose";

const SongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
      duration: { type: String, required: true } // <-- change this to String
  },
  { timestamps: true }
);

export default mongoose.model("Song", SongSchema);
