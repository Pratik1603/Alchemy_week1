import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

let PRIVATE_KEY=0;
function Wallet({ address, setAddress, balance, setBalance,privateKey,setPrivateKey }) {
 
  

  function getAddress(publicKey) {
    let n=publicKey.length;
    const last=publicKey.slice(1,n);
    const hash=keccak256(last);
    return toHex(hash.slice(-20)).toUpperCase();
  }

  async function importAccount(){
    const publicKey = secp.getPublicKey(privateKey);
    PRIVATE_KEY=privateKey;
    let add=getAddress(publicKey);
    add=add.toString();
    
    setAddress(add);
    console.log(add);
  
    if (add) {
      
      const {
        data: { balance },
      } = await server.get(`balance/${add}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Private Key
        <input placeholder="Type an address, for example: 0x1" value={privateKey} onChange={(e)=>setPrivateKey(e.target.value)}></input>
      </label>
      <div className="balance" onClick={()=>importAccount()}>
        Import Account
      </div>
      <div>
        Address :{address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}
const hashMessage = (message) => keccak256(Uint8Array.from(message));
export const sign = async (message) => {
    
  const hash = hashMessage(message);

  const [signature, recoveryBit] = await secp.sign(hash,PRIVATE_KEY, {
    recovered: true,
  });
  const fullSignature = new Uint8Array([recoveryBit, ...signature]);
  return toHex(fullSignature);
};
export default Wallet;

