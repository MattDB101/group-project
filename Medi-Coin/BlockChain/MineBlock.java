public void mineBlock(int difficulty) {
  nonce = 0;

  while (!getHash().substring(0,  difficulty).equals(Utils.zeros(difficulty))) {
    nonce++;
    hash = Block.calculateHash(this);
  }
}