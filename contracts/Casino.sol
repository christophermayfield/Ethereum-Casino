pragma solidity ^0.4.11;

contract Casino {
   address owner;
   function Casino(){
      owner = msg.sender;
   }
   function kill(){
      if(msg.sender == owner)
         selfdestruct(owner);
   }
}

uint minimumBet;
uint totalBet;
uint numberOfBets;
uint maxAmountOfBets = 100;
address[] players;
struct Player {
   uint amountBet;
   uint numberSelected;
}
mapping(address => Player) playerInfo;