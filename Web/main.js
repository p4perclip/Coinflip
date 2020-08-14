var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0x9752734b1F4d4ceE17E0B33AeC23c87F43a7f885", {from:accounts[0]});
      console.log(contractInstance);
    });


    $("#addBalance_button").click(addBalance);
    $("#withdrawBalance_button").click(withdrawBalance);
    $("#head_button").click(head);
    $("#tails_button").click(tails);
    $("#withdraw_button").click(withdrawAll);
    $("#fund_button").click(fund);

    getUserBalance();
    getBalance();

});
function addBalance(){
  var amount = $("#add_balance_input").val() ;
  var config = {
    value:web3.utils.toWei( amount, "ether")
  }
 contractInstance.methods.addBalance().send(config)
 .on ("transactionHash", function( hash) {
  console.log (hash);
});
}
function withdrawBalance(){
  contractInstance.methods.withdrawBalance().send()
  .then(function(result){
  result = web3.utils.fromWei(result, "ether");
  alert("Balance withdrawn")
  console.log(result);

});
}
function head(){
  var betAmount = $("#bet_size_input").val();
  var config ={ value:web3.utils.toWei(betAmount.toString(), "ether"), gas:1000000 }
  contractInstance.methods.bet(1).send(config)
  .on("transactionHash", function(hash){
    console.log(hash);
  });
  // .on("receipt", function(receipt){
  //   console.log("receipt:"+ JSON.stringify(receipt));
  //   getsUserBalance();
  //   getBalance();
  // });
}
function tails(){
  var betAmount = $("#bet_size_input").val();
  var config ={ value:web3.utils.toWei(betAmount.toString(), "ether"), gas:1000000 }
  contractInstance.methods.bet(0).send(config)
  .on("transactionHash", function(hash){
    console.log(hash);
  });
  // .on("receipt", function(receipt){
  //   console.log("receipt:"+ JSON.stringify(receipt));
  //   getsUserBalance();
  //   getBalance();
  // });
}
function withdrawAll(){
  contractInstance.methods.withdrawAll().send()
  .then(function(result){
  result = web3.utils.fromWei(result, "ether");
  alert("Balance withdrawn")
  console.log(result);
});
}
function fund(){
  var amount = $("#add_balance_input").val() ;
  var config = {
    value:web3.utils.toWei( amount, "ether")
  }
 contractInstance.methods.fund().send(config)
 .on ("transactionHash", function( hash) {
  console.log (hash);
});
}
function getUserBalance(){
  contractInstance.methods.getUserBalance().call().then(function(result1){
    newResult = web3.utils.fromWei(result1, "ether");
    console.log(newResult);
    $("#user_balance_output").text(+newResult);
  });
}
function getBalance(){
  contractInstance.methods.getBalance().call().then(function(result2){
    newResult1 = web.utils.fromWei(result2, "ether");
    console.log(newResult1);
    $("#balance_output").text(+newResult1);
  });
}
