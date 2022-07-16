// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

// import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title FileRegistry for GhostShare.xyz
 * @author Joris Zierold
 * @notice (NOTE OPTIONAL ADD SOME GENERAL INFO)
 * @dev Main contract which handles file tracing and access control.
 */
contract FileRegistry {
    /* ------------------------------ DATA STORAGE ------------------------------ */

    struct File {
        address fileOwner;
        mapping(address => bool) recipients;
    }

    mapping(bytes32 => File) public files;

    /* --------------------------------- EVENTS --------------------------------- */
    event FileRegistered(bytes32 fileId, address indexed fileOwner);
    event AccessGranted(bytes32 fileId, address indexed recipient);

    /* -------------------------------- MODIFIERS ------------------------------- */
    modifier onlyFileOwner(bytes32 fileId) {
        // requre msg.sender is owner of fileId
        require(
            files[fileId].fileOwner == msg.sender,
            "FileRegistry::onlyFileOwner: No access for this user."
        );
        _;
    }

    /* ------------------------------- CONSTRUCTOR ------------------------------ */
    constructor() {}

    /* -------------------------------------------------------------------------- */
    /*                                  FUNCTIONS                                 */
    /* -------------------------------------------------------------------------- */

    function registerFile(bytes32 fileId) public returns (bool success) {
        require(
            files[fileId].fileOwner == address(0),
            "FileRegistry::registerFile: File already exists."
        );
        files[fileId].fileOwner = msg.sender;
        emit FileRegistered(fileId, msg.sender);
        return true;
    }

    function grantAccess(bytes32 fileId, address recipient)
        public
        onlyFileOwner(fileId)
        returns (bool success)
    {
        files[fileId].recipients[recipient] = true;
        emit AccessGranted(fileId, recipient);
        return true;
    }

    function hasAccess(bytes32 fileId) public view returns (bool _hasAccess) {
        return files[fileId].recipients[msg.sender];
    }

    function helperFunctionToGetBytes32(string memory randomString)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(randomString));
    }
}