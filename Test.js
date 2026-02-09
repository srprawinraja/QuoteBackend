import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

