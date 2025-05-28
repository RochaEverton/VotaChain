document.addEventListener("DOMContentLoaded", function () {
  const walletBox = document.getElementById("walletBox");

  async function atualizarCarteira() {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        walletBox.innerHTML = `<span style="color:#0f0;">Carteira conectada:</span><br><span style="font-size:1.1em">${accounts[0]}</span>`;
        sessionStorage.setItem("walletAddress", accounts[0]);
      } else {
        walletBox.innerHTML = `<span style="color:#ff0;">Conecte sua carteira MetaMask para participar da votação.</span>`;
        sessionStorage.removeItem("walletAddress");
      }
    } else {
      walletBox.innerHTML = `<span style="color:#f44;">MetaMask não encontrada.</span>`;
    }

    // Limpa a mensagem de resultado ao trocar de carteira
    const resultDiv = document.getElementById('result');
    if (resultDiv) resultDiv.innerHTML = "";
  }

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', atualizarCarteira);
  }

  atualizarCarteira();
});


document.getElementById('voteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (typeof window.ethereum === "undefined") {
    alert("MetaMask não encontrada.");
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const walletAddress = accounts[0];

  // Mensagem a ser assinada
  const choice = e.submitter.value;
  const message = `Eu voto em: ${choice} - ${new Date().toISOString()}`;

  // Solicita assinatura
  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [message, walletAddress]
  });

  // Envia para o backend
  const res = await fetch('http://localhost:3000/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, choice, message, signature })
  });
  const data = await res.json();
  const resultDiv = document.getElementById('result');
  if (!res.ok) {
    resultDiv.innerHTML = `<div class="msgBox" style="background:#a00;color:#fff;">${data.error || 'Erro ao votar.'}</div>`;
    return;
  }
  resultDiv.innerHTML = `<div class="msgBox" style="background:#070;color:#fff;">Voto registrado! Hash: <span style="font-family:monospace">${data.txHash}</span></div>`;
});
