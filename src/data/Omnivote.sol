// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract OmniVote is CCIPReceiver, OwnerIsCreator, ReentrancyGuard {
  using SafeERC20 for IERC20;

  // Custom errors to provide more descriptive revert messages.
  error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance.
  error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
  error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
  error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.
  error SourceChainNotAllowlisted(uint64 sourceChainSelector); // Used when the source chain has not been allowlisted by the contract owner.
  error SenderNotAllowlisted(address sender); // Used when the sender has not been allowlisted by the contract owner.
  error InvalidReceiverAddress(); // Used when the receiver address is 0.

  uint256 public creationFee;
  uint256 public voteFee;

  struct DAOInfo {
    bytes32 daoId;
    address daoAddress;
    string name;
    string description;
  }

  struct Proposal {
    bytes32 proposalId;
    bytes32 daoId;
    string description;
    uint256 startTime;
    uint256 endTime;
    uint256 quorum;
    uint256 totalVotes;
    uint256 yesVotes; 
    uint256 noVotes;  
    uint256 abstainVotes; 
  }

  mapping(bytes32 => DAOInfo) public daos;
  mapping(bytes32 => Proposal) public proposals;
  mapping(bytes32 => bytes32) private proposalToDao; 
  bytes32[] public daoIds; 
  bytes32[] public proposalIds; 

  uint8 public constant VOTE_YES = 1;
  uint8 public constant VOTE_NO = 2;
  uint8 public constant VOTE_ABSTAIN = 3;

  event CreationFeeUpdated(uint256 newFee);
    event VoteFeeUpdated(uint256 newFee);
  event DaoAdded(bytes32 indexed daoId, address indexed daoCreator, string name, string description);

  event MinimumTokensUpdated(bytes32 indexed daoId, uint256 newMinimum);
  event ProposalCreated(
    bytes32 indexed proposalId,
    bytes32 indexed daoId,
    string description,
    uint256 startTime,
    uint256 endTime,
    uint256 quorum
  );
  event VoteSubmitted(address indexed voter, bytes32 indexed proposalId);

  event MessageSent(
    bytes32 indexed messageId, // The unique ID of the CCIP message.
    uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
    address receiver, // The address of the receiver on the destination chain.
    bytes message, // The message being sent.
    address feeToken, // the token address used to pay CCIP fees.
    uint256 fees // The fees paid for sending the CCIP message.
  );
  event MessageReceived(
    bytes32 indexed messageId, // The unique ID of the CCIP message.
    uint64 indexed sourceChainSelector, // The chain selector of the source chain.
    address sender, // The address of the sender from the source chain.
    bytes message // The text that was received.
  );

  bytes32 private s_lastReceivedMessageId; // Store the last received messageId.
  bytes32 private s_lastReceivedProposalId; // Store the last received proposalId.
  uint8 private s_lastReceivedVoteType; // Store the last received voteType.

  // Mapping to keep track of allowlisted destination chains.
  mapping(uint64 => bool) public allowlistedDestinationChains;

  // Mapping to keep track of allowlisted source chains.
  mapping(uint64 => bool) public allowlistedSourceChains;

  // Mapping to keep track of allowlisted senders.
  mapping(address => bool) public allowlistedSenders;


  constructor(address _router, uint256 initialCreationFee, uint256 initialVoteFee) CCIPReceiver(_router) {
    creationFee = initialCreationFee;
    voteFee = initialVoteFee;
  }

  /// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
  /// @param _destinationChainSelector The selector of the destination chain.
  modifier onlyAllowlistedDestinationChain(uint64 _destinationChainSelector) {
    if (!allowlistedDestinationChains[_destinationChainSelector])
      revert DestinationChainNotAllowlisted(_destinationChainSelector);
    _;
  }

  /// @dev Modifier that checks if the chain with the given sourceChainSelector is allowlisted and if the sender is allowlisted.
  /// @param _sourceChainSelector The selector of the destination chain.
  /// @param _sender The address of the sender.
  modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
    if (!allowlistedSourceChains[_sourceChainSelector]) revert SourceChainNotAllowlisted(_sourceChainSelector);
    if (!allowlistedSenders[_sender]) revert SenderNotAllowlisted(_sender);
    _;
  }

  /// @dev Modifier that checks the receiver address is not 0.
  /// @param _receiver The receiver address.
  modifier validateReceiver(address _receiver) {
    if (_receiver == address(0)) revert InvalidReceiverAddress();
    _;
  }

  /// @dev Updates the allowlist status of a destination chain for transactions.
  function allowlistDestinationChain(uint64 _destinationChainSelector, bool allowed) external onlyOwner {
    allowlistedDestinationChains[_destinationChainSelector] = allowed;
  }

  /// @dev Updates the allowlist status of a source chain for transactions.
  function allowlistSourceChain(uint64 _sourceChainSelector, bool allowed) external onlyOwner {
    allowlistedSourceChains[_sourceChainSelector] = allowed;
  }

  /// @dev Updates the allowlist status of a sender for transactions.
  function allowlistSender(address _sender, bool allowed) external onlyOwner {
    allowlistedSenders[_sender] = allowed;
  }

/// @notice to update the creation fee of proposals
  /// @dev Updates the creation fee of proposals
  function setCreationFee(uint256 newFee) external onlyOwner {
    creationFee = newFee;
    emit CreationFeeUpdated(newFee);
  }

  /// @notice to update the vote fee of proposals
  /// @dev Updates the vote fee of proposals
  function setVoteFee(uint256 newFee) external onlyOwner {
    voteFee = newFee;
    emit VoteFeeUpdated(newFee);
  }

/// @notice to  create a dao
  /// @dev Creates a dao
  function addDao(string memory _name, string memory _description) public payable returns (bytes32) {
    bytes32 daoId = generateDaoId(_name, _description, block.timestamp);
    require(daos[daoId].daoAddress == address(0), "DAO ID already in use");
    require(msg.value >= creationFee, "Insufficient fee");
    (bool success, ) = owner().call{value: creationFee}("");
    require(success, "Transfer failed");

    // DAO creation logic
    daos[daoId] = DAOInfo({daoId: daoId, daoAddress: msg.sender, name: _name, description: _description});
    daoIds.push(daoId); // Store the DAO ID in the array for easy retrieval
    emit DaoAdded(daoId, msg.sender, _name, _description);

    return daoId;
  }

/// @notice Get a paginated list of DAOs
/// @dev Gets a subset of DAOs using pagination to prevent gas limit issues
/// @param start The index to start retrieving DAOs from
/// @param limit The maximum number of DAOs to return
/// @return An array of DAOs from the specified start index
function getAllDaos(uint256 start, uint256 limit) public view returns (DAOInfo[] memory) {
    require(start < daoIds.length, "Start index out of bounds");
    uint256 end = start + limit > daoIds.length ? daoIds.length : start + limit; // Ensure we don't go out of bounds
    
    DAOInfo[] memory allDaos = new DAOInfo[](end - start);
    for (uint256 i = start; i < end; i++) {
        allDaos[i - start] = daos[daoIds[i]]; // Fill the result array
    }
    return allDaos;
}

  /// @dev Generates a dao id
  function generateDaoId(
    string memory _name,
    string memory _description,
    uint256 _timestamp
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_name, _description, _timestamp));
  }

/// @notice to create a proposal
  /// @dev Creates a proposal
  function createProposal(
    bytes32 _daoId,
    string calldata _description,
    uint256 _startTime,
    uint256 _endTime,
    uint256 _quorum
  ) public payable returns (bytes32) {
    bytes32 proposalId = generateProposalId(_daoId, _description, block.timestamp);
    require(proposals[proposalId].startTime == 0, "Proposal already exists");
    require(msg.value >= creationFee, "Insufficient fee");
    (bool success, ) = owner().call{value: creationFee}("");
    require(success, "Transfer failed");

    Proposal storage proposal = proposals[proposalId];
    proposal.proposalId = proposalId;
    proposal.daoId = _daoId;
    proposal.description = _description;
    proposal.startTime = _startTime;
    proposal.endTime = _endTime;
    proposal.quorum = _quorum;

    proposalToDao[proposalId] = _daoId;
    proposalIds.push(proposalId); // Store the proposal ID in the array for easy retrieval

    emit ProposalCreated(proposalId, _daoId, _description, _startTime, _endTime, _quorum);

    return proposalId;
  }

 /// @notice Get a paginated list of proposals
/// @dev Gets a subset of proposals using pagination to prevent gas limit issues
/// @param start The index to start retrieving proposals from
/// @param limit The maximum number of proposals to return
/// @return An array of proposals from the specified start index
function getAllProposals(uint256 start, uint256 limit) public view returns (Proposal[] memory) {
    require(start < proposalIds.length, "Start index out of bounds");
    uint256 end = start + limit > proposalIds.length ? proposalIds.length : start + limit; // Ensure we don't go out of bounds
    
    Proposal[] memory allProposals = new Proposal[](end - start);
    for (uint256 i = start; i < end; i++) {
        allProposals[i - start] = proposals[proposalIds[i]]; // Fill the result array
    }
    return allProposals;
}

/// @notice Generates a proposal id
  /// @dev  this is used to generate proposal id 
      /// @return the id generated
  function generateProposalId(
    bytes32 _daoId,
    string memory _description,
    uint256 _timestamp
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(_daoId, _description, _timestamp));
  }

  /// @dev Submit a vote
  function submitVote(bytes32 _proposalId, uint8 _voteType) external payable nonReentrant{
    Proposal storage proposal = proposals[_proposalId];
    require(block.timestamp >= proposal.startTime && block.timestamp <= proposal.endTime, "Voting not active");
    //Send the vote fee to the owner
    require(msg.value >= voteFee, "Insufficient fee");
    (bool success, ) = owner().call{value: voteFee}("");
    require(success, "Transfer failed");
      if (_voteType == VOTE_YES) {
        proposal.yesVotes += 1;
    } else if (_voteType == VOTE_NO) {
        proposal.noVotes += 1;
    } else if (_voteType == VOTE_ABSTAIN) {
        proposal.abstainVotes += 1;
    } else {
        revert("Invalid vote type");
    }
    proposal.totalVotes += 1;
    emit VoteSubmitted(msg.sender, _proposalId);
  }

  /// @notice get proposal details.
  /// @dev get proposal details
  /// @return description of the proposal
  /// @return startTime of the proposal
  /// @return endTime of the proposal
  /// @return quorum of the proposal
  /// @return totalVotes of the proposal
  /// @return yesVotes of the proposal
  /// @return noVotes of the proposal
 /// @return abstainVotes of the proposal
  function getProposalDetails(
    bytes32 _proposalId
  )
    external
    view
    returns (string memory description, uint256 startTime, uint256 endTime, uint256 quorum, uint256 totalVotes, uint256 yesVotes, uint256 noVotes, uint256 abstainVotes)
  {
    Proposal storage proposal = proposals[_proposalId];
    return (proposal.description, proposal.startTime, proposal.endTime, proposal.quorum, proposal.totalVotes, proposal.yesVotes,  proposal.noVotes, proposal.abstainVotes);
  }


  /// @notice performs cross chain vote.
  /// @dev Submit votes cross chain.
  /// @return messageId CCIP messageId.
  function submitVoteCrossChain(
    uint64 _destinationChainSelector,
    address _receiver,
    bytes32 _proposalIdText,
    uint8 _voteType
  )
    external payable nonReentrant
    onlyAllowlistedDestinationChain(_destinationChainSelector)
    validateReceiver(_receiver)
    returns (bytes32 messageId)
  {

    bytes memory encodedMessage = abi.encode(_proposalIdText, _voteType);
    Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(_receiver, encodedMessage, address(0));
    // Initialize a router client instance to interact with cross-chain router
    IRouterClient router = IRouterClient(this.getRouter());

    // Get the fee required to send the CCIP message
    uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

    if (fees > address(this).balance) revert NotEnoughBalance(address(this).balance, fees);

    //Send the vote fee to the owner
    require(msg.value >= voteFee, "Insufficient fee");
   (bool success, ) = owner().call{value: voteFee}("");
    require(success, "Transfer failed");

    // Send the CCIP message through the router and store the returned CCIP message ID
    messageId = router.ccipSend{value: fees}(_destinationChainSelector, evm2AnyMessage);

    // Emit an event with message details
    emit MessageSent(messageId, _destinationChainSelector, _receiver, encodedMessage, address(0), fees);

    // Return the CCIP message ID
    return messageId;
  }

  /// handle a received message
  function _ccipReceive(
    Client.Any2EVMMessage memory any2EvmMessage
  )
    internal
    override
    onlyAllowlisted(any2EvmMessage.sourceChainSelector, abi.decode(any2EvmMessage.sender, (address)))
  {
    (bytes32  _proposalId, uint8 _voteType) = abi.decode(any2EvmMessage.data, (bytes32, uint8));
    s_lastReceivedMessageId = any2EvmMessage.messageId; 
    s_lastReceivedProposalId= _proposalId;
    s_lastReceivedVoteType=_voteType;
    Proposal storage proposal = proposals[_proposalId];
    require(block.timestamp >= proposal.startTime && block.timestamp <= proposal.endTime, "Voting not active");

   if (_voteType == VOTE_YES) {
        proposal.yesVotes += 1;
    } else if (_voteType == VOTE_NO) {
        proposal.noVotes += 1;
    } else if (_voteType == VOTE_ABSTAIN) {
        proposal.abstainVotes += 1;
    } else {
        revert("Invalid vote type");
    }

    proposal.totalVotes += 1;

    emit VoteSubmitted(msg.sender, _proposalId);
    emit MessageReceived(
      any2EvmMessage.messageId,
      any2EvmMessage.sourceChainSelector,
      abi.decode(any2EvmMessage.sender, (address)),
      any2EvmMessage.data
    );
  }


  // Utility function to find the DAO ID from a proposal ID
  // Utility function to find the DAO ID from a proposal ID
  /// @notice Construct a CCIP message.
  /// @dev This function will create an EVM2AnyMessage struct with all the necessary information for sending a text.
  /// @param _receiver The address of the receiver.
  /// @param _message The string data to be sent.
  /// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
  /// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
  function _buildCCIPMessage(
    address _receiver,
    bytes memory _message,
    address _feeTokenAddress
  ) private pure returns (Client.EVM2AnyMessage memory) {
    // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
    return
      Client.EVM2AnyMessage({
        receiver: abi.encode(_receiver), // ABI-encoded receiver address
        data: _message, // ABI-encoded bytez
        tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array aas no tokens are transferred
        extraArgs: Client._argsToBytes(
          // Additional arguments, setting gas limit
          Client.EVMExtraArgsV1({gasLimit: 200_000})
        ),
        // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
        feeToken: _feeTokenAddress
      });
  }

  /// @notice Fetches the details of the last received message.
  /// @return messageId The ID of the last received messageId.
  /// @return proposalId The ID of the last received proposalId.
  /// @return voteType The last received voteType.
  function getLastReceivedMessageDetails() external view returns (bytes32 messageId, bytes32 proposalId, uint8 voteType) {
    return (s_lastReceivedMessageId, s_lastReceivedProposalId, s_lastReceivedVoteType);
  }

  /// @notice Fallback function to allow the contract to receive Ether.
  /// @dev This function has no function body, making it a default function for receiving Ether.
  /// It is automatically called when Ether is sent to the contract without any data.
  receive() external payable {}

  /// @notice Allows the contract owner to withdraw the entire balance of Ether from the contract.
  /// @dev This function reverts if there are no funds to withdraw or if the transfer fails.
  /// It should only be callable by the owner of the contract.
  /// @param _beneficiary The address to which the Ether should be sent.
  function withdraw(address _beneficiary) public onlyOwner {
    // Retrieve the balance of this contract
    uint256 amount = address(this).balance;

    // Revert if there is nothing to withdraw
    if (amount == 0) revert NothingToWithdraw();

    // Attempt to send the funds, capturing the success status and discarding any return data
    (bool sent, ) = _beneficiary.call{value: amount}("");

    // Revert if the send failed, with information about the attempted transfer
    if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
  }

  /// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
  /// @dev This function reverts with a 'NothingToWithdraw' error if there are no tokens to withdraw.
  /// @param _beneficiary The address to which the tokens will be sent.
  /// @param _token The contract address of the ERC20 token to be withdrawn.
  function withdrawToken(address _beneficiary, address _token) public onlyOwner {
    // Retrieve the balance of this contract
    uint256 amount = IERC20(_token).balanceOf(address(this));

    // Revert if there is nothing to withdraw
    if (amount == 0) revert NothingToWithdraw();

    IERC20(_token).safeTransfer(_beneficiary, amount);
  }

}
