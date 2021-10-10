public class Main {

  public static void main(String[] args) {
    Blockchain blockchain = new Blockchain();

    System.out.println("Blockchain valid ? " + blockchain.isBlockChainValid());
    System.out.println(blockchain);

    // add an invalid block to corrupt Blockchain
    blockchain.addBlock(new Block(15, System.currentTimeMillis(), "aaaabbb", "Block invalid"));

    System.out.println("Blockchain valid ? " + blockchain.isBlockChainValid());
  }
	
}