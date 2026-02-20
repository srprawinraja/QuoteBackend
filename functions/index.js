import express from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { initializeApp, cert } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";
import bodyParser from "body-parser";

dotenv.config({ path: "./secret.env" });
dotenv.config({ path: "./firebaseconfig.env" });

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT),
  ),
});

const db = admin.firestore();

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({ error: "Too many requests, slow down!" }),
});

// Helper function
function quoteIdFromText(quote) {
  return crypto
    .createHash("sha256")
    .update(quote.trim().toLowerCase())
    .digest("hex");
}

// API key check middleware
function checkApiKey(req, res, next) {
  const reqApiKey = req.header("x-api-key");
  if (!reqApiKey || reqApiKey !== process.env.KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  next();
}

// Initialize Express app
const app = express();
app.use(express.json()); // for parsing JSON bodies

/*

async function addRandomToQuotes() {
  const quotesCol = db.collection("quotes");
  const snapshot = await quotesCol.get();

  const batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    batch.update(doc.ref, {
      rand: Math.random()
    });

    count++;

    // Firestore batch limit = 500
    if (count === 500) {
      await batch.commit();
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log("Done updating quotes");
}
  */

// GET /random
app.get("/random", limiter, checkApiKey, async (req, res) => {
  try {
    const slug = req.query.slug;
    const quotesCol = db.collection("quotes");
    const r = Math.random()
    if (slug) {
      let querySnapshot = await quotesCol
        .where("slugs", "array-contains", slug)
        .where("rand", ">=", r)
        .orderBy("rand")
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        // fallback: get closest smaller rand
        querySnapshot = await quotesCol
          .where("slugs", "array-contains", slug)
          .where("rand", "<", r)
          .orderBy("rand", "desc") // descending to get closest smaller
          .limit(1)
          .get();
      }

      if (querySnapshot.empty)
        return res.status(200).json({ error: "No quotes found" });

      const quotesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const randomQuote =
        quotesArray[0];

      const tag = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return res.json({ ...randomQuote, slug, tag });
    }

    // No slug: get a random quote from all
    let querySnapshot = await quotesCol
        .where("rand", ">=", r)
        .orderBy("rand")
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        // fallback: get closest smaller rand
        querySnapshot = await quotesCol
          .where("rand", "<", r)
          .orderBy("rand", "desc") // descending to get closest smaller
          .limit(1)
          .get();
      }

    if (querySnapshot.empty)
      return res.status(404).json({ error: "No quotes found" });
      const quotesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const randomQuote =
        quotesArray[0];
      const tag = randomQuote.slugs[0]
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return res.json({ ...randomQuote, slug, tag });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /quote
app.post("/quote", checkApiKey, async (req, res) => {
  try {
    const { author, quote, slugs } = req.body;

    if (
      !author ||
      !quote ||
      !slugs ||
      !Array.isArray(slugs) ||
      slugs.length === 0
    ) {
      return res.status(400).json({ error: "Missing or invalid params" });
    }

    const validSlugs = [];
    const chunkSize = 10;

    for (let i = 0; i < slugs.length; i += chunkSize) {
      const chunk = slugs.slice(i, i + chunkSize);
      const tagsCol = db.collection("tags");
      const q = tagsCol.where("slug", "in", chunk);
      const snapshot = await q.get();

      snapshot.forEach((doc) => validSlugs.push(doc.data().slug));
    }

    if (validSlugs.length === 0)
      return res.status(404).json({ error: "No valid tags found" });

    const docRef = db.collection("quotes").doc(quoteIdFromText(quote));
    await docRef.set({ author, quote, rand: Math.random(), slugs: validSlugs });

    res.json({ message: "Quote added", id: docRef.id });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /tags
app.get("/tags", limiter, checkApiKey, async (req, res) => {
  try {
    const tagsCol = db.collection("tags");
    const snapshot = await tagsCol.get();
    const tags = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(tags);
  } catch (err) {
    //console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /tag
app.post("/tag", limiter, checkApiKey, async (req, res) => {
  try {
    const { tag, slug, img } = req.body;
    if (!tag || !slug || !img)
      return res.status(400).json({ error: "Missing params" });

    const docRef = await db.collection("tags").add({ tag, slug, img });
    res.json({ message: "Tag added", id: docRef.id });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/health", (req, res) => {
  res.send("works fine");
});

// Start server
const PORT = process.env.PORT || 4000;   

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
