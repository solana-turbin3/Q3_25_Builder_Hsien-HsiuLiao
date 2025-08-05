# User Stories & On-Chain Requirements

## 1. Concert Goers

### User Story 1.1
**"User accesses sound level data for specific venues and concerts."**

**Potential On-Chain Requirements:**
- Data will be previously submitted by other users
- Data will be stored in accounts called `soundlevels` and have seeds `soundlevel` and `user key`

### User Story 1.2
**"User records and submits sound level recording."**

**Potential On-Chain Requirements:**
- Create a new account to store metadata about the sound recording including a link to the recording
- Account struct fields could include decibels, venue, seat number, date/time, user id, etc.
- If valued data is stored on chain, should be encrypted
- Can also include ratings and comments in account data
- Needs a feedback field from other users

### User Story 1.3
**"User contributes data to earn tokens."**

**Potential On-Chain Requirements:**
- Create a mint account and mint tokens to users for certain tasks
- Create associated token account to store tokens

## 2. Health Conscious People

### User Story 2.1
**"User views educational content on the impact of sound levels on hearing health."**

**Potential On-Chain Requirements:**
- None

## 3. Sound Engineers

### User Story 3.1
**"User engages with concert goers to provide expert advice on sound levels and seating choices to receive tokens."**

**Potential On-Chain Requirements:**
- Verify activity and provide tokens upon completion
- Create a mint account and mint tokens
- Create associated token account to store tokens
- Need a role or something to verify they are sound engineers

### User Story 3.2
**"User analyzes user-submitted sound level data for accuracy and relevance, providing feedback to improve data quality and receive tokens in return."**

**Potential On-Chain Requirements:**
- Verify activity and provide tokens upon completion
- Create a mint account and mint tokens
- Create associated token account to store tokens

---

# Technical Requirements

## Backend Development Requirements

- **Database Management System**: Set up a database (e.g., PostgreSQL, MongoDB) to store user-generated sound level data, reviews, and venue information.

- **API Development**: Create RESTful APIs to handle data retrieval and submission, allowing the app to communicate between the frontend and backend.
  - **GET API**: For retrieving sound level data and concert information.
  - **POST API**: For submitting user contributions (sound level experiences, ratings, comments).

## Sound Level Data Management

- **Data Collection Mechanism**: Use smart phone mic and functionality to record sound level.

- **Data Validation**: Implement validation checks to ensure that submitted sound level data is accurate and within expected ranges.

## Blockchain Integration (Solana)

- **Token Management**: Develop smart contracts on the Solana blockchain to manage token issuance and transactions related to user contributions. Functions/instructions include mint tokens to users, transfer tokens, allowing data collected to be accessible.

- **Data Ownership**: Implement mechanisms for users to own and potentially sell their data, ensuring compliance with blockchain standards.

- **User Profiles**: Create user profiles that store individual contributions, preferences, and earned tokens. Info stored in account on Solana blockchain.