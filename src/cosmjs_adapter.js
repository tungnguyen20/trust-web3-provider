// Copyright © 2017-2022 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

"use strict";

class CosmJSOfflineSigner {
  constructor(chainId, krystalwallet) {
    this.chainId = chainId;
    this.krystalwallet = krystalwallet;
  }
  async getAccounts() {
    const key = await this.krystalwallet.getKey(this.chainId);
    return [
      {
        address: key.bech32Address,
        algo: "secp256k1",
        pubkey: key.pubKey,
      },
    ];
  }

  async signAmino(signerAddress, signDoc) {
    if (this.chainId !== signDoc.chain_id) {
      throw new Error("Unmatched chain id with the offline signer");
    }
    const key = await this.krystalwallet.getKey(signDoc.chain_id);
    if (key.bech32Address !== signerAddress) {
      throw new Error("Unknown signer address");
    }
    return await this.krystalwallet.signAmino(
      this.chainId,
      signerAddress,
      signDoc,
      {}
    );
  }

  async sign(signerAddress, signDoc) {
    return await this.signAmino(signerAddress, signDoc);
  }

  async signDirect(signerAddress, signDoc) {
    if (this.chainId !== signDoc.chainId) {
      throw new Error("Unmatched chain id with the offline signer");
    }
    const key = await this.krystalwallet.getKey(signDoc.chainId);
    if (key.bech32Address !== signerAddress) {
      throw new Error("Unknown signer address");
    }
    return await this.krystalwallet.signDirect(
      this.chainId,
      signerAddress,
      signDoc
    );
  }
}

module.exports = CosmJSOfflineSigner;
