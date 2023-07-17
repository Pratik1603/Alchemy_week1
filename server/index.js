const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const crypto = require("./crypto");

const balances = {
  "008A73FE496AC0ADCC4C792C9497ED1E2CBC9F5E": 100,
  "15DFF04A4710202D3A9B6AB5CCC9E7CAF2392BB8": 50,
  "8A65BD5173A803797DA852725E391B52157FEF61": 75,
};

app.get("/balance/:address", (req, res) => {

  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  
  const { message, signature } = req.body;
  const { recipient, amount } = message;

  const pubKey = crypto.signatureToPubKey(message, signature);
  const sender = crypto.pubKeyToAddress(pubKey);


  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
