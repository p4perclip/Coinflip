pragma solidity 0.5.12;

import "./Ownable.sol";
contract CoinFlip is Ownable {

  constructor() public payable{
    owner = msg.sender;
}

  modifier costs(uint cost){
        require(msg.value >= cost,"Not enough ETH sent!");
        _;
    }

uint public balance;

mapping(address => uint256) public userBalance;
mapping(address => bool) public lastFlip;


  event BettingResult(address caller, uint256 amount , bool won);
  event Withdrawal (uint256 userBalance);
  event Deposit (uint256 userBalance);



    function random() private view returns (uint256) {
    return now % 2;
    }
    function addBalance() public payable returns(uint256){
    userBalance[msg.sender] += msg.value;
    emit Deposit(msg.value);
    }
    function withdrawBalance() public returns(uint256) {
    uint toTransfer = userBalance[msg.sender];
    userBalance[msg.sender] = 0;
    msg.sender.transfer(toTransfer);
    return toTransfer;
    }
    function minBet() public pure returns(uint256) {
    return 1 ether;
    }

    function maxBet() public view returns(uint256) {
    return balance / 100;
    }
    function bet(uint256 betType ) public payable returns (bool){
    require (betType == 1 || betType == 0, "heads are 1 || tails will be 0");
    require (msg.value <= userBalance[msg.sender] && msg.value >=minBet() && msg.value <= balance, "sender cant exceed current balance and need palace bet");

    if ((random() == 0 && betType == 0) || (random() == 1 && betType == 1)) {
        userBalance[msg.sender] += (msg.value*2);
        balance -= msg.value;
        lastFlip[msg.sender] = true;
        emit BettingResult(msg.sender,msg.value,true);
        return lastFlip[msg.sender];
      } else {
        userBalance[msg.sender] -= msg.value;
        balance +=msg.value;
        lastFlip[msg.sender] = false;
        emit BettingResult(msg.sender,0,false);
        return lastFlip[msg.sender];
      }
    }
    function getBalance()public view returns(uint256){
    return balance;
    }
    function getUserBalance () public view returns (uint256){
      return userBalance[msg.sender];
    }
    function withdrawAll() public onlyOwner returns(uint256) {
      uint toTransfer = balance;
      balance = 0;
      msg.sender.transfer(toTransfer);
      return toTransfer;
    }
    function fund() public payable onlyOwner returns(uint256){
      balance += msg.value;
      emit Deposit(msg.value);
    }
    function close() public onlyOwner{
      address payable reciever = msg.sender;
      selfdestruct(reciever);
    }
}
