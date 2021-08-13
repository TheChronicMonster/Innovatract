// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

contract Innovatract{
    
    struct  User{
        uint StakeAmount;
        uint GoalDuration;
        string GoalDiscription;
        string GoalName;
        uint CheckInterval;
        uint StartDate;
        uint EndDate;
        mapping (address => uint) AmountStake;
    
        
        //stake Amount should be constant
    }
    enum GoalAcheived {Inprogress,Acheived,UnAcheived }
    
     mapping(uint => User ) public UserCount;
     
     uint public UserId;
   
    function createUser(
    uint _StakeAmount, string memory _GoalsDiscrption, uint 
    _GoalDuration,uint _StartDate, uint _EndDate,
    uint _CheckInterval, string memory _GoalName) public {
        User storage user = UserCount[UserId];
        user.StakeAmount = _StakeAmount;
        user.GoalDuration = _GoalDuration;
        user.GoalDiscription = _GoalsDiscrption;
        user.GoalName = _GoalName;
        user.CheckInterval = _CheckInterval;
        user.StartDate = _StartDate;
        user.EndDate = _EndDate;
        UserId++;
        user.AmountStake[msg.sender] = user.StakeAmount;
        
    }
     function deposit() external payable {
    }
    
    function balance() external view returns(uint){
        return address(this).balance;
    }
    
    function sendEther(address payable recipient, uint StakeAmount) external {
    
        //convert StakeAmount to ether from wei
        recipient.transfer(StakeAmount * 1e18);
    }
}