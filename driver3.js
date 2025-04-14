function acceptCoin(coin) {
    const isValid = blindSignatures.verify({
      unblinded: coin.signature,
      message: coin.hash,
      key: {
        n: coin.n,
        e: coin.e
      }
    });
  
    if (!isValid) {
      throw new Error("Invalid coin signature!");
    }
  
    const [leftHashes, rightHashes] = parseCoin(coin.string);
    let ris = [];
  
    for (let i = 0; i < COIN_RIS_LENGTH; i++) {
    
      const choice = Math.floor(Math.random() * 2);
      const halfIdentity = (choice === 0) ? leftHashes[i] : rightHashes[i];
      ris.push(halfIdentity);
    }
  
    return ris;
  }
  
  function determineCheater(guid, ris1, ris2) {
    for (let i = 0; i < COIN_RIS_LENGTH; i++) {
      if (ris1[i] !== ris2[i]) {
        const buf1 = Buffer.from(ris1[i], 'hex');
        const buf2 = Buffer.from(ris2[i], 'hex');
  
        const xorResult = Buffer.alloc(buf1.length);
        for (let j = 0; j < buf1.length; j++) {
          xorResult[j] = buf1[j] ^ buf2[j];
        }
  
        const xorStr = xorResult.toString();
        
        if (xorStr.startsWith(IDENT_STR)) {
          const identity = xorStr.slice(IDENT_STR.length);
          console.log(Double spender detected! Identity revealed: ${identity});
        } else {
          console.log(Merchant is the cheater for coin ${guid}.);
        }
        return;
      }
    }
    console.log("No cheating detected.");
  }