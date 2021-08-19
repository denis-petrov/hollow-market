package com.hollow.market.prepare;

import com.google.gson.GsonBuilder;
import com.hollow.market.prepare.Block;

import java.util.ArrayList;

public class NoobChain {

    public static ArrayList<Block> blockchain = new ArrayList<Block>();
    public static int difficulty = 5;

    public static void main(String[] args) {

        System.out.println("Trying to Mine block 1 ...");
        addBlock(new Block("Hi i'm the first block.", "0"));

        System.out.println("Trying to Mine block 2... ");
        addBlock(new Block("Yo im the second block", blockchain.get(blockchain.size() - 1).getHash()));

        System.out.println("Trying to Mine block 3 ...");
        addBlock(new Block("Hey i'm the third block ", blockchain.get(blockchain.size() - 1).getHash()));

        System.out.println("\nBlockchain is Valid: " + isChainValid());

        String blockchainJson = new GsonBuilder().setPrettyPrinting().create().toJson(blockchain);
        System.out.println("\nThe block chain: ");
        System.out.println(blockchainJson);
    }

    public static Boolean isChainValid() {
        Block currBlock;
        Block prevBlock;
        String hashTarget = new String(new char[difficulty]).replace('\0', '0');

        for (int i = 1; i < blockchain.size(); i++) {
            prevBlock = blockchain.get(i - 1);
            currBlock = blockchain.get(i);

            if (!currBlock.getHash().equals(currBlock.calculateHash())) {
                System.out.println("Current Hashes not equals");
                return false;
            }

            if (!prevBlock.getHash().equals(currBlock.getPrevHash())) {
                System.out.println("Prev Hashes not equals");
                return false;
            }

            if (!currBlock.getHash().substring(0, difficulty).equals(hashTarget)) {
                System.out.println("This block hasn't been mined");
                return false;
            }
        }
        return true;
    }

    public static void addBlock(Block newBlock) {
        newBlock.mineBlock(difficulty);
        blockchain.add(newBlock);
    }
}
