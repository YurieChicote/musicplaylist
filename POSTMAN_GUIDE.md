# 🚀 How to Test Your API with Postman

## ⚠️ IMPORTANT: Use Vercel URL, NOT localhost!

Your API is deployed at: **`https://musicplaylist-seven.vercel.app`**

---

## 📝 Step-by-Step Postman Guide

### 1. **Change URL in Postman**

In Postman, change the URL from:
```
http://localhost:3000/api/v1/songs
```

To:
```
https://musicplaylist-seven.vercel.app/api/v1/songs
```

---

### 2. **Test GET Request (Get All Songs)**

1. **Method:** Select `GET` from dropdown
2. **URL:** `https://musicplaylist-seven.vercel.app/api/v1/songs`
3. **Headers:** None needed
4. Click **"Send"**
5. **Expected Response:** `[]` (empty array) or list of songs

---

### 3. **Test POST Request (Create a Song)**

1. **Method:** Select `POST` from dropdown
2. **URL:** `https://musicplaylist-seven.vercel.app/api/v1/songs`
3. **Headers Tab:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body Tab:**
   - Select **"raw"**
   - Select **"JSON"** from dropdown
   - Paste this JSON:
     ```json
     {
       "title": "Never Say Never",
       "artist": "Justin Bieber, Jayden Samir",
       "duration": "3:45"
     }
     ```
5. Click **"Send"**
6. **Expected Response:** The created song object with `_id`, `title`, `artist`, `duration`, `createdAt`, `updatedAt`

---

### 4. **Test GET Request (Get All Playlists)**

1. **Method:** `GET`
2. **URL:** `https://musicplaylist-seven.vercel.app/api/v1/playlists`
3. Click **"Send"**
4. **Expected Response:** `[]` or list of playlists

---

### 5. **Test POST Request (Create a Playlist)**

1. **Method:** `POST`
2. **URL:** `https://musicplaylist-seven.vercel.app/api/v1/playlists`
3. **Headers:** `Content-Type: application/json`
4. **Body (raw JSON):**
   ```json
   {
     "name": "My Favorite Songs",
     "description": "Best playlist ever"
   }
   ```
5. Click **"Send"**

---

## 🎯 All Available Endpoints

### Songs:
- `GET https://musicplaylist-seven.vercel.app/api/v1/songs` - Get all songs
- `GET https://musicplaylist-seven.vercel.app/api/v1/songs/:id` - Get one song
- `POST https://musicplaylist-seven.vercel.app/api/v1/songs` - Create song
- `PUT https://musicplaylist-seven.vercel.app/api/v1/songs/:id` - Update song
- `PATCH https://musicplaylist-seven.vercel.app/api/v1/songs/:id` - Partial update
- `DELETE https://musicplaylist-seven.vercel.app/api/v1/songs/:id` - Delete song

### Playlists:
- `GET https://musicplaylist-seven.vercel.app/api/v1/playlists` - Get all playlists
- `GET https://musicplaylist-seven.vercel.app/api/v1/playlists/:id` - Get one playlist
- `POST https://musicplaylist-seven.vercel.app/api/v1/playlists` - Create playlist
- `PUT https://musicplaylist-seven.vercel.app/api/v1/playlists/:id` - Update playlist
- `POST https://musicplaylist-seven.vercel.app/api/v1/playlists/:id/songs` - Add song to playlist
- `DELETE https://musicplaylist-seven.vercel.app/api/v1/playlists/:id/songs/:songId` - Remove song
- `DELETE https://musicplaylist-seven.vercel.app/api/v1/playlists/:id` - Delete playlist

---

## ✅ Quick Test Checklist

- [ ] GET all songs returns `[]` or array
- [ ] POST song creates successfully
- [ ] GET all playlists returns `[]` or array
- [ ] POST playlist creates successfully
- [ ] Root route works: `https://musicplaylist-seven.vercel.app/`

---

## 🐛 Troubleshooting

**If you get connection errors:**
- Make sure you're using `https://` not `http://`
- Use the full Vercel URL, not localhost
- Check Vercel deployment is live

**If you get authentication errors:**
- This is normal - your API doesn't require auth
- Make sure you're sending `Content-Type: application/json` header for POST requests

