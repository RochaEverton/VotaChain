const express = require('express');
const cors = require('cors');
const Web3 = require('web3');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao Ganache
const web3 = new Web3('http://ganache:8545'); // Nome do container no compose

app.post('/api/vote', async (req, res) => {
  const { voterId, choice } = req.body;
  const data = `${voterId}:${choice}`;
  const hash = web3.utils.sha3(data);

  try {
    const accounts = await web3.eth.getAccounts();
    const tx = await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[0],
      value: 0,
      data: hash
    });

    res.json({ status: 'registrado', txHash: tx.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao registrar voto' });
  }
});


app.post('/api/vote', async (req, res) => {
  const { voterId, choice } = req.body;

  const data = `${voterId}:${choice}`;
  const hash = web3.utils.sha3(data); // Gera hash usando Keccak256

  try {
    // Envia transação fictícia para registrar o hash
    const tx = await web3.eth.sendTransaction({
      from: account,
      to: account,
      value: 0,
      data: hash
    });

    res.json({ status: 'registrado', txHash: tx.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao registrar voto' });
  }
});

app.listen(3000, () => console.log('API ouvindo na porta 3000'));
