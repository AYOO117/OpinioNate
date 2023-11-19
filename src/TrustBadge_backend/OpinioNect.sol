// Layout of Contract:
// SPDX-License-Identifier: MIT

// version
pragma solidity ^0.8.18;

// imports

// errors

// interfaces, libraries, contracts
// error FundMe__NotOwner();

/**
 * @title OpinioNect Smart Contract
 * @author Jaskirat Singh
 * @notice This contract is for giving your comments/opinions on an article
 * @dev Does not implement anything
 */
contract OpinioNect{
    // Type declarations
    // mapping(address => mapping(uint256 => uint256)) public outerMappings;
    // State variables
    address private immutable i_owner;
    string[] public articleHash;
    struct UserComment{
        // mapping(address => string) userToarticleHash;
        address userAddress;
        string comment;
    }
    
    mapping(string => UserComment[]) public articleToUserComments;

    // Events
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == i_owner, "Only Owner Action!");
        // if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }
    // modifier oneUserOneComment(string memory _articleHash) {
    //     if(articleToUserComments[_articleHash].userAddress){
    //         _;
    //     }
    // }
    modifier oneUserOneComment(string memory _articleHash) {
    bool hasCommented = false;
    
    // Iterate through existing comments for the article
    UserComment[] memory comments = articleToUserComments[_articleHash];
    for (uint256 i = 0; i < comments.length; i++) {
        if (comments[i].userAddress == msg.sender) {
            hasCommented = true;
            break;
        }
    }

    require(!hasCommented, "You have already commented on this article.");
    _;
    }


    // Functions
    // Layout of Functions:
    // constructor
    constructor() {
        i_owner = msg.sender;
    }

    // receive function (if exists)
    // fallback function (if exists)
    // external
    // public
    function addArticle(string calldata _articleHash) public onlyOwner {
        articleHash.push(_articleHash);
    }

    function addComment(string calldata _articleHash, string calldata _userComment) public {
        UserComment memory userComment = UserComment(msg.sender, _userComment);
        articleToUserComments[_articleHash].push(userComment);
    }

    function getCommentsOnArticle(string calldata _articleHash) view public returns (string[] memory) {
    UserComment[] memory comments = articleToUserComments[_articleHash];
    string[] memory commentsArray = new string[](comments.length);

    for (uint256 i = 0; i < comments.length; i++) {
        commentsArray[i] = comments[i].comment;
    }

    return commentsArray;
    }

    function articleHashLength() view public returns (uint256) {
        uint256 length = articleHash.length;
        return length;
    }

    // internal
    // private
    // view & pure functions

}
