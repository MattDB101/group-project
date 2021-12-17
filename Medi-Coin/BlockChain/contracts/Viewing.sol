pragma solidity ^0.5.0;

contract Viewing {
	address[16] public viewers;
	
	// Viewing a patient
	function viewing(uint patientId) public returns (uint) {
	  require(patientId >= 0 && patientId <= 15);

	  viewers[patientId] = msg.sender;

	  return patientId;
	}
	
	// Retrieving the viewers
	function getViewers() public view returns (address[16] memory) {
	  return viewers;
	}
}