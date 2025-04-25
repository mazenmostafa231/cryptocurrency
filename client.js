give(name, amount) {
    let message = {
      from: this.name,
      to: name,
      amount: amount,
    };

    let sign = this.signObject(message);
  
    
    this.net.broadcast(XFER, { message: message, signature: sign });
  }