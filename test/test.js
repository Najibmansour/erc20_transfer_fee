const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("MYtoken Contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2, feeAddr] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("BNBGold");

    const bnbg = await Token.deploy();

    await bnbg.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Token, bnbg, owner, addr1, addr2, feeAddr };
  }
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const { bnbg, owner, addr1, addr2, feeAddr } = await loadFixture(
      deployTokenFixture
    );

    bnbg.mint(owner.address, 1000);
    bnbg.mint(addr1.address, 1000);
    bnbg.mint(addr2.address, 1000);

    const oB = await bnbg.balanceOf(owner.address);
    const o1 = await bnbg.balanceOf(addr1.address);
    const o2 = await bnbg.balanceOf(addr2.address);
    const bal = parseInt(oB) + parseInt(o1) + parseInt(o2);
    expect(await bnbg.totalSupply()).to.equal(3000);
  });

  it("should transfer from address to other minus 15% fee and 2% burn", async function () {
    //amount to transfer
    const { bnbg, addr1, addr2, feeAddr } = await loadFixture(
      deployTokenFixture
    );

    const MINT = 1000;
    const amount = 103;
    const fee = Math.floor((amount * 15) / 100);
    const burned = Math.floor((amount * 2) / 100);
    await bnbg.setFeeAddress(feeAddr.address);

    bnbg.mint(addr1.address, MINT);
    bnbg.mint(addr2.address, MINT);

    const sucTransfer = await bnbg
      .connect(addr1)
      .transfer(addr2.address, amount);

    const addr1Bal = await bnbg.balanceOf(addr1.address);
    const addr2Bal = await bnbg.balanceOf(addr2.address);
    const feeAddrBal = await bnbg.balanceOf(feeAddr.address);
    console.log(`address 1: ${addr1Bal}`);
    console.log(`address 2: ${addr2Bal}`);
    console.log(`Fee addr : ${feeAddrBal}`);
    console.log(`Totalsup : ${await bnbg.totalSupply()}`);

    expect(addr1Bal).to.equal(MINT - amount);
    expect(addr2Bal).to.equal(MINT + amount - fee - burned);
    expect(feeAddrBal).to.equal(fee);
  });
});
