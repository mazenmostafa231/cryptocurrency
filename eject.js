trudy.fakeGive = function(name, amount) {
    let message = {
      from: this.name,
      to: name,
      amount: amount,
    };
  
    let signature = this.signObject(message);

    this.net.send(name, XFER, {
      message: message,
      signature: signature
    });
  
    this.log(Secretly sent ${amount} to ${name});
  };