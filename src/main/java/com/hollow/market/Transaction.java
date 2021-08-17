package com.hollow.market;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.util.ArrayList;

public class Transaction {

    private String transactionId;
    private PublicKey sender;
    private PublicKey recipient;
    private float value;
    private byte[] signature;

    private ArrayList<TransactionInput> inputs = new ArrayList<TransactionInput>();
    private ArrayList<TransactionOutput> outputs = new ArrayList<TransactionOutput>();

    private static int sequence = 0;

    public Transaction(PublicKey sender, PublicKey recipient, float value, ArrayList<TransactionInput> inputs) {
        this.sender = sender;
        this.recipient = recipient;
        this.value = value;
        this.inputs = inputs;
    }

    private String calculateHash() {
        sequence++;
        return StringUtil.applySha256(
                StringUtil.getStringFromKey(sender) +
                        StringUtil.getStringFromKey(recipient) +
                        Float.toString(value) +
                        sequence);
    }

    public void generateSignature(PrivateKey privateKey) {
        String data = StringUtil.getStringFromKey(sender) + StringUtil.getStringFromKey(recipient) + value;
        signature = StringUtil.applyECDSASig(privateKey, data);
    }

    public boolean verifySignature() {
        String data = StringUtil.getStringFromKey(sender) + StringUtil.getStringFromKey(recipient) + value;
        return StringUtil.verifyECDSASig(sender, data, signature);
    }
}
