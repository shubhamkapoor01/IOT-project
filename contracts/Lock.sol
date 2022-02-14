// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Lock is ERC721 {
    constructor() ERC721("Lock", "LCK") {

    }

    mapping (address => uint[]) allowedOfPerson;
    mapping (address => uint[]) productsOfPerson;
    mapping (uint => Product) productNft;
    uint productIdCount = 0;

    /*  creates a new product and appends it to list of global products along with information about 
        the product ie name, description, owner address and initially no one is allowed to use it. */
    function addProduct(string memory name, string memory description) public {
        address[] memory empty;
        Product memory product = Product(name, description, msg.sender, empty, productIdCount);
        _mint(msg.sender, productIdCount);
        productNft[productIdCount] = product;
        productsOfPerson[msg.sender].push(productIdCount);
        grantPermission(productIdCount, msg.sender);
        productIdCount ++;
    }

    /*  creates a new product and appends it to list of global products along with information about 
        the product ie name, description, owner address and address of who all are allowed to use it. */
    function addProductWithAllowed(string memory name, string memory description, address[] memory allowed) public {
        Product memory product = Product(name, description, msg.sender, allowed, productIdCount);
        _mint(msg.sender, productIdCount);
        productNft[productIdCount] = product;
        productsOfPerson[msg.sender].push(productIdCount);
        grantPermission(productIdCount, msg.sender);
        for (uint i = 0; i < allowed.length; i ++) {
            allowedOfPerson[allowed[i]].push(productIdCount);
        }
        productIdCount ++;
    }

    /* checks if the product with Id productId belongs to the user that has invoked the function */
    function checkOwner(uint productId) public view returns (bool) {
        address realOwner = productNft[productId].ownerAddress;
        return realOwner == msg.sender;
    }
    
    /* checks if a user has permission from the product owner to use a particular product */
    function isAllowed(uint productId, address userToCheckAllowed) public view returns (bool) {
        for (uint i = 0; i < productNft[productId].allowedToUse.length; i ++) {
            if (productNft[productId].allowedToUse[i] == userToCheckAllowed) {
                return true;
            }
        }
        return false;
    }

    /* the user is allowed to view all the permissions they have been granted */
    function myPermissions() public view returns (Product[] memory) {
        Product[] memory iCanUse = new Product[](allowedOfPerson[msg.sender].length);
        for (uint i = 0; i < allowedOfPerson[msg.sender].length; i ++) {
            Product memory currProduct = productNft[allowedOfPerson[msg.sender][i]];
            iCanUse[i] = currProduct;
        }
        return iCanUse;
    }

    /* the user is allowed to view all the products that they own */
    function myProducts() public view returns (Product[] memory) {
        Product[] memory iOwn = new Product[](productsOfPerson[msg.sender].length);
        for (uint i = 0; i < productsOfPerson[msg.sender].length; i ++) {
            Product memory currProduct = productNft[productsOfPerson[msg.sender][i]];
            iOwn[i] = currProduct;
        }
        return iOwn;
    }

    /* the owner is allowed to give usage rights of the product to another user */
    function grantPermission(uint productId, address userToGrantPermission) public {
        if (!checkOwner(productId)) {
            return;
        }

        allowedOfPerson[userToGrantPermission].push(productId);
        productNft[productId].allowedToUse.push(userToGrantPermission);
    }

    /* the owner is allowed to take back the usage rights of the product from user */
    function revokePermission(uint productId, address userToRevokePermission) public {
        if (!checkOwner(productId)) {
            return;
        }

        for (uint i = 0; i < productNft[productId].allowedToUse.length; i ++) {
            if (userToRevokePermission == productNft[productId].allowedToUse[i]) {
                while (i < productNft[productId].allowedToUse.length - 1) {
                    productNft[productId].allowedToUse[i] = productNft[productId].allowedToUse[i + 1];
                    i ++;
                }
                delete productNft[productId].allowedToUse[productNft[productId].allowedToUse.length - 1];
                break;
            }
        }

        for (uint i = 0; i < allowedOfPerson[userToRevokePermission].length; i ++) {
            if (productId == allowedOfPerson[userToRevokePermission][i]) {
                while (i < allowedOfPerson[userToRevokePermission].length - 1) {
                    allowedOfPerson[userToRevokePermission][i] = allowedOfPerson[userToRevokePermission][i + 1];
                    i ++;
                }
                delete allowedOfPerson[userToRevokePermission][allowedOfPerson[userToRevokePermission].length - 1];
                break;
            }
        }
    }

    /*  owner has rights to give the product(NFT) to anyone, that person will become
        the new owner and previous owner will no longer have it, all users who had 
        access to the product under the old owner will keep their access unless the 
        new owner decides to modify it */
    function transferOwnership(uint productId, address newOwner) public {
        if (!checkOwner(productId)) {
            return;
        }

        bool belongsToOldOwner = false;
        for (uint i = 0; i < productsOfPerson[msg.sender].length; i ++) {
            if (productsOfPerson[msg.sender][i] == productId) {
                belongsToOldOwner = true;
                while (i < productsOfPerson[msg.sender].length - 1) {
                    productsOfPerson[msg.sender][i] = productsOfPerson[msg.sender][i + 1];
                    i ++;
                }
                delete productsOfPerson[msg.sender][productsOfPerson[msg.sender].length - 1];
                break;
            }
        }

        if (!belongsToOldOwner) {
            return;
        }
        productsOfPerson[newOwner].push(productId); 

        address previousOwner = ownerOf(productId);
        _transfer(previousOwner, msg.sender, productId);
    }
}

struct Product {
    string name;
    string description;
    address ownerAddress;
    address[] allowedToUse;
    uint productId;
}