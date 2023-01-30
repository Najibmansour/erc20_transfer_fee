// SPDX-License-Identifier: MIT
// Added transfer fee on transfer by 
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BNBGold is ERC20, ERC20Burnable, Pausable, Ownable {
    constructor() ERC20("BNBGold", "MTK") {}

    address public feeAddress;

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function transfer(address to, uint256 amount) public whenNotPaused override returns(bool){
        
        address owner = _msgSender();
        uint256 fee =  amount * 15 /100;
        uint256 toBeBurnt =  amount * 2 /100;
        // 2% will be burnt from the amount sent 
        _transfer(owner, to, amount - fee - toBeBurnt);
        _transfer(owner, feeAddress, fee);
        _burn(owner, toBeBurnt);

        return true;
    }

    function setFeeAddress(address _address) public onlyOwner {
        feeAddress = _address;
    }
}
