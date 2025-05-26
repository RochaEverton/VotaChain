document.getElementById('voteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const voterId = document.getElementById('voterId').value;
  const choice = document.getElementById('choice').value;

  const res = await fetch('http://localhost:3000/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voterId, choice })
  });

  const data = await res.json();
  document.getElementById('result').innerText = `Voto registrado! Hash: ${data.txHash}`;
});