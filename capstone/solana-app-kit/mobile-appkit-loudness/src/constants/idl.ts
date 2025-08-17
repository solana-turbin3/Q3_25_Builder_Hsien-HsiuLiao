// Anchor program IDL - copied from anchor-loudness/target/idl/anchor_loudness.json
export const ANCHOR_LOUDNESS_IDL = {
  "address": "3chRm8Uw232StQpy6G5nVAokSz7bTiUN4e6pvB95PRw2",
  "metadata": {
    "name": "anchor_loudness",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claim",
      "discriminator": [62, 198, 214, 193, 213, 159, 108, 210],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [108, 111, 117, 100, 110, 101, 115, 115, 95, 99, 111, 110, 102, 105, 103]
              }
            ]
          }
        },
        {
          "name": "user_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [117, 115, 101, 114]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user_rewards_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142]
              }
            ]
          }
        },
        {
          "name": "rewards_mint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [114, 101, 119, 97, 114, 100, 115]
              },
              {
                "kind": "account",
                "path": "config"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token_program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createSubmission",
      "discriminator": [123, 45, 67, 89, 12, 34, 56, 78],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [108, 111, 117, 100, 110, 101, 115, 115, 95, 99, 111, 110, 102, 105, 103]
              }
            ]
          }
        },
        {
          "name": "user_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [117, 115, 101, 114]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "venue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "config"
              },
              {
                "kind": "arg",
                "path": "venue_name"
              }
            ]
          }
        },
        {
          "name": "submission",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "venue"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "venue_name",
          "type": "string"
        },
        {
          "name": "sound_level_data",
          "type": {
            "defined": "SoundLevelData"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "rewards_bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Submission",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "venue",
            "type": "pubkey"
          },
          {
            "name": "concert_goer",
            "type": "pubkey"
          },
          {
            "name": "sound_level_data",
            "type": {
              "defined": "SoundLevelData"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "SoundLevelData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sound_level",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "seat_number",
            "type": "u8"
          },
          {
            "name": "user_rating",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "UserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "num_of_submissions",
            "type": "u8"
          },
          {
            "name": "points_to_claim",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "SoundLevelData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sound_level",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "seat_number",
            "type": "u8"
          },
          {
            "name": "user_rating",
            "type": "u8"
          }
        ]
      }
    }
  ]
} as any;

// Program ID from your Anchor.toml
export const ANCHOR_LOUDNESS_PROGRAM_ID = "3chRm8Uw232StQpy6G5nVAokSz7bTiUN4e6pvB95PRw2";

// RPC endpoint
export const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com";

// Commitment level
export const COMMITMENT = "confirmed" as const; 