import express from 'express';
const app = express();
const port = 3001; // Port berbeda dari frontend

app.get('/', (req, res) => {
  res.send('Hello from STROOMP API!');
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
