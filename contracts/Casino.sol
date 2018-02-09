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