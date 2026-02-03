pragma solidity ^0.4.11;

// ----------------------------------------------------------------------------
// WARNING: THIS IS A MOCK CONTRACT FOR DEVELOPMENT AND TESTING PURPOSES ONLY.
// IT IS NOT SECURE. IT ALLOWS ANY CALLER TO SIMULATE THE ORACLE CALLBACK.
// DO NOT USE THIS IN PRODUCTION.
// ----------------------------------------------------------------------------

contract usingOraclize {
    byte constant proofType_Ledger = 0x30;
    byte constant proofType_Native = 0xF0;
    byte constant proofType_Slice = 0xF1;
    byte constant proofType_Android = 0xF2;
    byte constant proofType_None = 0x00;

    function oraclize_setProof(byte _proofP) public {
    }

    function oraclize_getPrice(string _datasource) public returns (uint) {
        return 0;
    }

    function oraclize_getPrice(string _datasource, uint _gasLimit) public returns (uint) {
        return 0;
    }

    function oraclize_newRandomDSQuery(uint _delay, uint _nbytes, uint _customGasLimit) public returns (bytes32) {
        // For testing, just return a predictable hash or random-ish
        return keccak256(block.number);
    }

    function oraclize_cbAddress() public returns (address) {
        // SECURITY RISK: Returns msg.sender so anyone can call __callback
        return msg.sender;
    }

    modifier oraclize_randomDS_proofVerify(bytes32 _queryId, string _result, bytes _proof) {
        _;
    }
}
