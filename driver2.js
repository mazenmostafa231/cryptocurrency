"use strict";

let blindSignatures = require('blind-signatures');
let SpyAgency = require('./spyAgency.js').SpyAgency;

function makeDocument(coverName) {
  return The bearer of this signed document, ${coverName}, has full diplomatic immunity.;
}

function blind(msg, n, e) {
  return blindSignatures.blind({
    message: msg,
    N: n,
    E: e,
  });
}

function unblind(blindingFactor, sig, n) {
  return blindSignatures.unblind({
    signed: sig,
    N: n,
    r: blindingFactor,
  });
}

let agency = new SpyAgency();

let identities = [
  "James Bond", "Ethan Hunt", "Jason Bourne", "Natasha Romanoff", "Alec Trevelyan",
  "Sydney Bristow", "George Smiley", "Evelyn Salt", "Illya Kuryakin", "Gabriel Allon"
];

let documents = identities.map(makeDocument);

let blindDocs = [];
let blindingFactors = [];

for (let doc of documents) {
  let { blinded, r } = blind(doc, agency.n, agency.e);
  blindDocs.push(blinded);
  blindingFactors.push(r);
}

agency.signDocument(blindDocs, (selected, verifyAndSign) => {
  
  let docsForVerification = [...documents];
  let factorsForVerification = [...blindingFactors];

  docsForVerification[selected] = undefined;
  factorsForVerification[selected] = undefined;

  let blindedSignature = verifyAndSign(factorsForVerification, docsForVerification);

  let unblindedSignature = unblind(blindingFactors[selected], blindedSignature, agency.n);

  let isValid = blindSignatures.verify({
    unblinded: unblindedSignature,
    message: documents[selected],
    N: agency.n,
    E: agency.e,
  });

  if (isValid) {
    console.log("Success! The document was properly signed and verified.");
  } else {
    console.log("Failed to verify the signed document.");
  }
});
