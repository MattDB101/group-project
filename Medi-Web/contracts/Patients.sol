pragma solidity ^0.5.0;

contract Patients {
    uint public patientCount = 0;

    struct Details {
        uint id;
        string name;
        string addr;
        string email;
        string tel;
        string wallet;
    }

    mapping(uint => Details) public patientDetails;

    constructor() public {
        createPatient("First Last Name", "Address", "Email", "0123456789", "Wallet Address");
    }

    function createPatient(string memory _name, string memory _addr, string memory _email, string memory _tel, string memory _wallet) public {
        patientCount ++;
        patientDetails[patientCount] = Details(patientCount, _name, _addr, _email, _tel, _wallet);
  }

}