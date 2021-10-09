public Block latestBlock() {
  return blocks.get(blocks.size() - 1);
}

public Block newBlock(String data) {
  Block latestBlock = latestBlock();
  return new Block(latestBlock.getIndex() + 1, System.currentTimeMillis(),
      latestBlock.getHash(), data);
}

public void addBlock(Block b) {
  if (b != null) {
    b.mineBlock(difficulty);
    blocks.add(b);
  }
}