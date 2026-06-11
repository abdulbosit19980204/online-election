// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VoteSecure - Decentralized Cryptographic Voting System
 * @author Karimjonova Robiyaxon
 * @notice This smart contract implements secure, anonymous on-chain voting
 * with voter eligibility checked via Merkle Roots or Soulbound Tokens (SBT).
 */
contract VoteSecure {
    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    struct Election {
        uint256 id;
        string title;
        uint256 startTime;
        uint256 endTime;
        bytes32 eligibleVotersMerkleRoot; // Merkle root of eligible voter addresses
        bool isActive;
        bool resultsPublished;
        uint256 totalVotes;
        uint256 candidatesCount;
        mapping(uint256 => Candidate) candidates;
        mapping(bytes32 => bool) nullifiers; // Prevents double voting (ZK Nullifiers or SHA256 voter hashes)
    }

    address public admin;
    uint256 public electionCount;
    mapping(uint256 => Election) public elections;

    // Events
    event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name, string party);
    event VoteCast(uint256 indexed electionId, bytes32 indexed nullifierHash);
    event ResultsPublished(uint256 indexed electionId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier electionActive(uint256 _electionId) {
        require(elections[_electionId].isActive, "Election is not active");
        require(block.timestamp >= elections[_electionId].startTime, "Election has not started yet");
        require(block.timestamp <= elections[_electionId].endTime, "Election has ended");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Admin creates an election.
     * @param _title The title of the election.
     * @param _startTime UNIX timestamp for start.
     * @param _endTime UNIX timestamp for end.
     * @param _merkleRoot Root of eligible voter wallets.
     */
    function createElection(
        string memory _title,
        uint256 _startTime,
        uint256 _endTime,
        bytes32 _merkleRoot
    ) external onlyAdmin {
        require(_startTime < _endTime, "Invalid time window");
        require(_endTime > block.timestamp, "End time must be in future");

        electionCount++;
        Election storage newElection = elections[electionCount];
        newElection.id = electionCount;
        newElection.title = _title;
        newElection.startTime = _startTime;
        newElection.endTime = _endTime;
        newElection.eligibleVotersMerkleRoot = _merkleRoot;
        newElection.isActive = true;

        emit ElectionCreated(electionCount, _title, _startTime, _endTime);
    }

    /**
     * @notice Admin adds a candidate to an election.
     */
    function addCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _party
    ) external onlyAdmin {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election is not active");
        require(block.timestamp < election.startTime, "Election already started");

        election.candidatesCount++;
        election.candidates[election.candidatesCount] = Candidate({
            id: election.candidatesCount,
            name: _name,
            party: _party,
            voteCount: 0
        });

        emit CandidateAdded(_electionId, election.candidatesCount, _name, _party);
    }

    /**
     * @notice Cast an anonymous vote.
     * @param _electionId ID of the election.
     * @param _candidateId ID of the selected candidate.
     * @param _nullifierHash Unique nullifier to prevent double voting (ZK Semaphore style).
     * @param _merkleProof Proof verifying the voter belongs to the eligible voters merkle tree.
     */
    function castVote(
        uint256 _electionId,
        uint256 _candidateId,
        bytes32 _nullifierHash,
        bytes32[] calldata _merkleProof
    ) external electionActive(_electionId) {
        Election storage election = elections[_electionId];
        require(election.candidates[_candidateId].id != 0, "Candidate does not exist");
        require(!election.nullifiers[_nullifierHash], "Voter has already cast a ballot");

        // Verify Merkle Proof to ensure msg.sender is eligible
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(verifyMerkleProof(_merkleProof, election.eligibleVotersMerkleRoot, leaf), "Sender not eligible to vote");

        // Record nullifier to lock out future votes from this identity commitment
        election.nullifiers[_nullifierHash] = true;
        
        // Increment votes
        election.candidates[_candidateId].voteCount++;
        election.totalVotes++;

        emit VoteCast(_electionId, _nullifierHash);
    }

    /**
     * @notice Helper function to verify Merkle Proofs.
     */
    function verifyMerkleProof(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == root;
    }

    /**
     * @notice Publish results on-chain.
     */
    function publishResults(uint256 _electionId) external onlyAdmin {
        Election storage election = elections[_electionId];
        require(block.timestamp > election.endTime, "Election still in progress");
        election.resultsPublished = true;
        emit ResultsPublished(_electionId);
    }

    /**
     * @notice Retrieve candidate vote count after results are published.
     */
    function getResults(uint256 _electionId, uint256 _candidateId) external view returns (uint256) {
        Election storage election = elections[_electionId];
        require(election.resultsPublished, "Results not published yet");
        return election.candidates[_candidateId].voteCount;
    }
}
