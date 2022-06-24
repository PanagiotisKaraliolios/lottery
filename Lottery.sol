pragma solidity ^0.5.9;

contract Lottery {

    struct Person{
        uint personId;
        address addr;
    }

    struct Item {
        uint itemId;
        string name;
        address[] itemTokens;
        bool hasWinner;
    }

    struct Winner {
        address addr;
        uint itemId;
    }

    // Define an array of winners
    Winner[] public winners;

    // // In the lottery, there are available three items:
    // // 1. Car
    // // 2. Phone
    // // 3. Computer

    // // Create the array of items
    Item[3] public items ;

    // Define a boolean variable to chek if the winners have been drawn
    bool public winnersDrawn = false;

    // Define the number of biders
    uint bidderCount = 0;

    // Define an array of bidders
    Person[] public bidders;

    // Define the address of the owner
    address payable public owner;

    // Define the address of the second owner
    address payable public owner2 = 0x153dfef4355E823dCB0FCc76Efe942BefCa86477;

    // Create the constructor
    constructor() public payable {
        // Set the owner address
        owner = msg.sender;
        // Add the items to the array of items
        address[] memory emptyArray;
        items[0] = Item({
            itemId: 0,
            name: "Car",
            itemTokens: emptyArray,
            hasWinner: false
        });
        items[1] = Item({
            itemId: 1,
            name: "Phone",
            itemTokens: emptyArray,
            hasWinner: false
        });
        items[2] = Item({
            itemId: 2,
            name: "Computer",
            itemTokens: emptyArray,
            hasWinner: false
        });
    }

    // Set the bid amount, required to be paid by the bider the first time,
    // to be 0.01 ether
    uint public bidAmount = 0.01 ether;

    // Define the function to bid for the item
    function bid(uint _itemId) public payable {
        // Require 0.01 ether to register
        require(msg.value >= bidAmount);

        // Require the user to not be the owner
        require(msg.sender != owner && msg.sender != owner2);

        // Require winners to not have been drawn
        require(!winnersDrawn);
        
        // Check if the user is already registered. If not, register the user
        // and charge the user the bid amount
        if (!isRegistered(msg.sender)) {
            register(msg.sender);
        }

        // Add a token to the item
        addTokenToItem(_itemId, msg.sender);

    }

    // Define the function to check if the user is registered
    function isRegistered(address _addr) private view returns (bool) {
        // Check if the user is registered
        for (uint i = 0; i < bidderCount; i++) {
            if (bidders[i].addr == _addr) {
                return true;
            }
        }
        return false;
    }

    // Define the private function to register a new bider
    function register(address _addr) private {
        
        // Add the bider to the array of biders
        bidders.push(Person({
            personId: bidderCount,
            addr: _addr
        }));

        // Increase the number of biders
        bidderCount++;
    }

    // Define the function to add a token to the item
    function addTokenToItem(uint _itemId, address _addr) private {
        // Add a token to the item
        items[_itemId].itemTokens.push(_addr);
    }

    // Define a function that returns an array of how many tokens are in each item
    function getNumTokens() public view returns (uint[] memory) {
        uint[] memory numTokens = new uint[](3);
        for (uint i = 0; i < 3; i++) {
            numTokens[i] = items[i].itemTokens.length;
        }
        return numTokens;
    }

    // Define a function that reveals the winners
    function revealWinners() public onlyOwner {
        // Check if the winners have been drawn
        require(!winnersDrawn);

        // for each item, check if there is a winner
        for (uint i = 0; i < 3; i++) {
            if (items[i].hasWinner == false) {
                // If there is no winner, check if there are enough tokens
                if (items[i].itemTokens.length > 0) {
                    // If there are enough tokens, draw the winners
                    drawWinners(i);
                }
            }
        }

        // Set the winners drawn to true
        winnersDrawn = true;

    }

    // Define the function to draw the winners
    function drawWinners(uint _itemId) private {
        // Get the number of tokens in the item
        uint numTokens = items[_itemId].itemTokens.length;

        // Get a random number between 0 and the number of tokens
        uint randomNum = uint(keccak256(abi.encodePacked(block.timestamp))) % numTokens;

        // Get winner
        address winner = items[_itemId].itemTokens[randomNum];

        // Add the winner to the array of winners
        winners.push(Winner({
            addr: winner,
            itemId: _itemId
        }));

        // Set the item to have a winner
        items[_itemId].hasWinner = true;

    }

    // Define a function that returns an array with the number of the items won.
    // If none, return 0
    function getItemsWon() public view returns (uint[] memory) {
        uint[] memory itemsWon = new uint[](3);
        // Require the winners to have been drawn
        require(winnersDrawn);

        // Require the user to not be the owner
        require(msg.sender != owner && msg.sender != owner2);

        // Require the user to be registered
        require(isRegistered(msg.sender));

        uint _items = 0;
        // Check if the user is a winner
        for (uint i = 0; i < winners.length; i++) {
            if (winners[i].addr == msg.sender) {
                // If the user is a winner, add the item to the array of items won
                itemsWon[_items] = winners[i].itemId + 1;  
                _items++;              
            }
        }
        uint[] memory shrinkedItemsWon = new uint[](_items);
        for (uint j = 0; j < _items; j++) {
            shrinkedItemsWon[j] = itemsWon[j];
        }

        return shrinkedItemsWon;
    }

    function reset() public onlyOwner {

        require(winnersDrawn);
        // Delete the winners
        while(winners.length > 0){
            winners.pop();
        }
        // Delete the biders
        while(bidders.length > 0){
            bidders.pop();
        }
        // Reset the number of bidders
        bidderCount = 0;
        // Add the items to the array of items
        address[] memory emptyArray;
        items[0] = Item({
            itemId: 0,
            name: "Car",
            itemTokens: emptyArray,
            hasWinner: false
        });
        items[1] = Item({
            itemId: 1,
            name: "Phone",
            itemTokens: emptyArray,
            hasWinner: false
        });
        items[2] = Item({
            itemId: 2,
            name: "Computer",
            itemTokens: emptyArray,
            hasWinner: false
        });
        // Reset the number of winners
        winnersDrawn = false;
    }

    // Define the function to transfer the ownership of the contract
    function transferOwnership(address payable _newOwner) public onlyOwner {
        // Set the new owner
        owner = _newOwner;
    }


    // Define a function to withdraw the funds into the owner's wallet
    function withdrawFunds() public onlyOwner {
        
        // Withdraw the funds
        msg.sender.transfer(address(this).balance);
    }

    // Define funcion to destroy the contract
    function destroy() public onlyOwner {
        // Destroy the contract
        selfdestruct(owner);
    }

    // Define a modifier to check if the user is the owner
    modifier onlyOwner {
        require(msg.sender == owner || msg.sender == owner2);
        _;
    }
        
}