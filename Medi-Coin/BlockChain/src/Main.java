public class Main {

    public static void main(String[] args) {
        Blockchain blockchain = new Blockchain(3);
        blockchain.addBlock(blockchain.newBlock("Test"));
        blockchain.addBlock(blockchain.newBlock("Test2"));

        System.out.println("After adding 2 Blocks, \nBlockchain valid? " + blockchain.isBlockChainValid());
        System.out.println("\n" + blockchain);

        // Invalid Block test
        blockchain.addBlock(new Block(10, System.currentTimeMillis(), "eakjuhfa;sldvj", "Invalid Test"));

        System.out.println("After adding Invalid Block, \nBlockchain valid? " + blockchain.isBlockChainValid());
        System.out.println("\n" + blockchain);
    }

}