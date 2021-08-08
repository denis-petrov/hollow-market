package com.hollow.market;

import java.util.Date;

public class Block {

    private String hash;
    private final String prevHash;
    private final String data;
    private final long timeStamp;
    private int nonce;

    public Block(String data, String prevHash) {
        this.data = data;
        this.prevHash = prevHash;
        this.timeStamp = new Date().getTime();

        this.hash = calculateHash();
    }

    public String getHash() {
        return hash;
    }

    public String getPrevHash() {
        return prevHash;
    }

    public String calculateHash() {
        return StringUtil.applySha256(prevHash + timeStamp + nonce + data);
    }

    public void mineBlock(int difficulty) {
        String target = StringUtil.getDifficultyString(difficulty);
        while (!hash.substring(0, difficulty).equals(target)) {
            nonce++;
            hash = calculateHash();
        }
        System.out.println("Block has been mined : " + hash);
    }
}
