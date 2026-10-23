# Ruby

Private support bot for Number One. Tracks GitHub commits and deploys into Discord changelogs, watches support forums for new posts, and tags forum threads on request.

Blackpink-inspired: clean, sharp, confident. No sugar.

## What it does

- **Changelogs.** New commits on the tracked branch go into one **Unreleased** message in your changelog channel. When the deploy workflow succeeds, that message becomes the release changelog and staff is pinged. Failed deploys are reported; commits wait for the next successful deploy.
  If the changelog channel is an **Announcement** channel, releases are published so following servers receive them. Drafts, failed deploys, and pings stay in your server.
- **Weekly digest.** Optional. Instead of per-release posts to followers, one message a week with everything shipped (internal commits like `ci`, `test`, `chore` are filtered).
- **New posts.** Every new post in the forums you list pings staff.
- **Fixed from a commit.** Put `fixes #<post ID>` in a commit message. When that commit is deployed, the post is tagged **Fixed**, the opener is notified, and the thread is locked.
- **Pinging staff.** Anyone who pings the configured staff member gets a short timeout (default 60 seconds) and a short reply. The original message stays. Moderators and replies to staff messages are left alone.
- **Tags.** In any forum post:
  - `@Ruby fixed` — tag **Fixed** and lock
  - `@Ruby completed` — tag **Completed** and lock
  - `@Ruby lock` / `@Ruby unlock`
  - `@Ruby mark as <tag>` (multiple: `mark as bug, urgent`)
  - `@Ruby unmark <tag>`, or `@Ruby unmark` to clear all
  - `@Ruby tags` to list the forum's tags
  - Multiple actions with *and*, *then*, or `;`

  Only the configured staff member and people with **Manage Threads** can change tags.

Polls GitHub every minute (configurable). No webhook or public URL required.

## Setup

Node 23.6 or newer. TypeScript runs directly, no build step.

1. Create a Discord application in the [Developer Portal](https://discord.com/developers/applications). Reset the bot token and copy it. No privileged intents required.
2. Invite (replace `APP_ID`):
   `https://discord.com/oauth2/authorize?client_id=APP_ID&scope=bot&permissions=1391569472512`
   (View Channels, Send Messages, Send Messages in Threads, Read Message History, Manage Threads, Timeout Members. Role must sit above users it should be able to timeout.)
3. Copy `.env.example` to `.env` and add your Discord token and a GitHub token that can read the repos (e.g. `gh auth token`).
4. Copy `ruby.config.example.json` to `ruby.config.json` and fill it in:

   | Setting | What it is |
   | --- | --- |
   | `ownerId` | Discord user ID of the staff member to ping |
   | `changelogChannelId` | Text channel for changelogs |
   | `watchForumIds` | Forums where new posts ping staff |
   | `repos` | Each repo, its `branch` (default `main`) and optional `deployWorkflow` file |
   | `ownerPingTimeoutSeconds` | Timeout length for pinging staff (default 60, max 600, 0 disables) |
   | `pollSeconds` | How often to check GitHub (default 60, minimum 30) |
   | `digest` | Optional. `{ "day": "monday", "hourUtc": 16 }` for weekly digest instead of every release |

   Enable Developer Mode in Discord to copy IDs.
5. `npm install`, then `npm start`.

On first start it only records the current state of each repo. It does not post history.

## Development

- `npm test` — changelog, config, command, and tag logic
- `npm run check` — type check
- All messages live in `src/voice.ts`

## Notes

Private bot. Separate Discord application from Number One. No web dashboard. State is stored in `state.json` (gitignored).
