const express = require('express');
const cors = require('cors');
const Web3 = require('web3');

const app = express();
app.use(cors());
app.use(express.json());

// CONEXÃO COM GANACHE
const web3 = new Web3('http://ganache:8545');


let votos = [];
let transacoes = [];

app.post('/api/vote', async (req, res) => {
  const { walletAddress, choice, message, signature } = req.body;
  const timestamp = new Date().toISOString();

  // Verifica assinatura
  const recovered = web3.eth.accounts.recover(message, signature);
  if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
    return res.status(401).json({ error: "Assinatura inválida" });
  }

  // Bloqueia voto duplicado
  if (votos.some(v => v.walletAddress.toLowerCase() === walletAddress.toLowerCase())) {
    return res.status(403).json({ error: "Esta carteira já votou." });
  }

  votos.push({ walletAddress, choice, timestamp });

  const data = `${walletAddress}:${choice}`;
  const hash = web3.utils.sha3(data);

  try {
    const accounts = await web3.eth.getAccounts();
    const tx = await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[0],
      value: 0,
      data: hash
    });

    transacoes.push({
      hash: tx.transactionHash,
      from: accounts[0],
      to: accounts[0],
      walletAddress, // adiciona a carteira do usuário que votou
      choice,
      timestamp
    });

    res.json({ status: 'registrado', txHash: tx.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar voto' });
  }
});

app.get('/api/votes', (req, res) => {
  res.json(votos);
});

app.get('/api/votes-count', (req, res) => {
  const counts = votos.reduce((acc, voto) => {
    acc[voto.choice] = (acc[voto.choice] || 0) + 1;
    return acc;
  }, {});
  res.json(counts);
});

app.get('/api/votes-detail', (req, res) => {
  const detail = {};
  votos.forEach(voto => {
    if (!detail[voto.choice]) {
      detail[voto.choice] = { total: 0, carteiras: [] };
    }
    detail[voto.choice].total += 1;
    detail[voto.choice].carteiras.push(voto.walletAddress);
  });
  res.json(detail);
});

app.get('/api/transactions', (req, res) => {
  res.json(transacoes);
});

app.listen(3000, () => {
  console.log('API ouvindo na porta 3000');
});
