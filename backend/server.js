const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/api/vote', (req, res) => {
  const { voterId, choice } = req.body;
  console.log(`Recebido voto de ${voterId}: ${choice}`);
  res.json({ status: 'registrado', hash: `0x${Math.random().toString(16).slice(2)}` });
});

app.listen(3000, () => console.log('API ouvindo na porta 3000'));