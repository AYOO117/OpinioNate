// Layout of Contract:
// SPDX-License-Identifier: MIT

// version
pragma solidity ^0.8.20;

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

import "@openzeppelin/contracts/access/Ownable.sol";

contract OpinioNect is Ownable {
    // Type declarations

    // State variables
    string[] public articleHash;
    struct UserComment {
        address userAddress;
        string comment;
    }
    
    mapping(string => UserComment[]) public articleToUserComments;

    // Modifiers
    modifier oneUserOneComment(string memory _articleHash) {
        bool hasCommented = false;
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

    // Constructor
    constructor(address initialOwner) Ownable(initialOwner) {}

    // Functions
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
