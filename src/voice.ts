// src/voice.ts
//
// Everything Ruby says. Confident, stylish, direct — Blackpink energy without the sugar.
// Black, pink, sharp. No baby talk, no hearts, no nya.

/** One of several lines so she doesn't sound like a template. */
export function pick(lines: string[], rand: () => number = Math.random): string {
  return lines[Math.floor(rand() * lines.length)];
}

const sha7 = (sha: string, url: string) => `[\\`${sha.slice(0, 7)}\\`](<${url}>)`;

export const voice = {
  unreleasedIntro: () =>
    pick([
      "New commits. Holding them until they ship.",
      "Fresh work on the branch. Waiting on the deploy.",
      "Commits landed. Keeping the list ready.",
    ]),

  /** Published to every following server. Clean and neutral. */
  shippedIntro: () =>
    pick([
      "Shipped.",
      "New drop.",
      "Live now.",
    ]),

  /** Opens the weekly digest. */
  digestIntro: () =>
    pick([
      "This week's changes.",
      "Weekly update.",
      "Everything shipped this week.",
    ]),

  deployed: (owner: string) =>
    pick([
      `<@${owner}> Deployed. It's live.`,
      `<@${owner}> Shipped. Check the channel.`,
      `<@${owner}> Live now.`,
    ]),

  redeployed: (owner: string) =>
    pick([
      `<@${owner}> Redeployed. No new commits this time.`,
      `<@${owner}> Fresh deploy. Same code, running clean.`,
    ]),

  deployFailed: (owner: string, run: number, url: string) =>
    pick([
      `<@${owner}> Deploy [#${run}](<${url}>) failed. Commits are still waiting.`,
      `<@${owner}> Deploy [#${run}](<${url}>) didn't go through. Ready for the next try.`,
    ]),

  newPost: (owner: string, postId: string) =>
    pick([
      `<@${owner}> New post.`,
      `<@${owner}> Someone opened a thread.`,
    ]) + `\\n-# Put \\`fixes #${postId}\\` in a commit to mark it Fixed when it ships.`,

  /** Sent in the post once the fixing commit is deployed. */
  fixShipped: (reporter: string | null, sha: string, url: string) =>
    (reporter ? `<@${reporter}> ` : "") +
    pick([
      `Fixed in ${sha7(sha, url)}. It's live.`,
      `Resolved in ${sha7(sha, url)}. Deployed.`,
    ]),

  /** Said to someone who pinged staff. No ping back. */
  ownerBusy: (owner: string, seconds: number) =>
    pick([
      `<@${owner}> may be busy. Please wait.`,
      `Staff may be occupied. Please be patient.`,
    ]) + (seconds ? `\\n-# Pinging gets a ${duration(seconds)} timeout. Your message stays.` : ""),

  marked: (tags: string[]) =>
    pick([`Tagged as ${list(tags)}.`, `Marked ${list(tags)}.`, `Set to ${list(tags)}.`]),

  closedLocked: (tag: string) =>
    pick([
      `Marked as **${tag}** and locked.`,
      `**${tag}** and locked.`,
    ]),

  unmarked: (tags: string[]) => pick([`Removed ${list(tags)}.`, `${list(tags)} off.`]),

  unmarkedAll: () => pick(["All tags cleared.", "Tags removed."]),

  alreadyMarked: (tags: string[]) => `Already tagged as ${list(tags)}.`,

  notMarked: (tags: string[]) => `Not tagged as ${list(tags)}.`,

  nothingChanged: () => "No change.",

  /** Summary of a multi-action command. */
  changed(added: string[], removed: string[], closedAs: string | null, locking: boolean | null, clearedAll: boolean): string {
    const tagsOnly = locking === null;
    if (closedAs && locking && removed.length === 0 && added.every((t) => t === closedAs)) return voice.closedLocked(closedAs);
    if (added.length === 0 && removed.length === 0) return locking ? voice.lockedOnly() : voice.unlockedOnly();
    if (tagsOnly && clearedAll) return voice.unmarkedAll();
    if (tagsOnly && removed.length === 0) return voice.marked(added);
    if (tagsOnly && added.length === 0) return voice.unmarked(removed);
    const parts = [
      added.length ? `tagged as ${list(added)}` : null,
      removed.length ? `removed ${list(removed)}` : null,
      locking === true ? "locked it" : locking === false ? "unlocked it" : null,
    ].filter(Boolean) as string[];
    const said = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0];
    return `${said[0].toUpperCase()}${said.slice(1)}${locking ? ". Done." : ""}`;
  },

  lockedOnly: () => pick(["Locked.", "Thread locked."]),

  unlockedOnly: () => pick(["Unlocked.", "Thread open again."]),

  alreadyLocked: () => "Already locked.",

  notLocked: () => "Not locked.",

  tooManyTags: () => "A post can only have 5 tags. Remove one first.",

  tags: (names: string[]) => (names.length ? `Available tags: ${list(names)}` : "This forum has no tags."),

  notForum: () => "Tagging only works inside a forum post.",

  notAllowed: () => "Only people who can manage threads can change tags.",

  cantEdit: () => "I don't have permission to edit this post. Need **Manage Threads**.",

  help: () =>
    [
      "I'm **Ruby**. In a forum post:",
      "`@Ruby fixed` — tag **Fixed** and lock",
      "`@Ruby completed` — tag **Completed** and lock",
      "`@Ruby mark as <tag>` — add tag(s)",
      "`@Ruby unmark <tag>` — remove tag(s)",
      "`@Ruby unmark` — clear all tags",
      "`@Ruby lock` / `unlock` — lock or unlock the post",
      "`@Ruby tags` — list available tags",
      "Chain with *and*: `mark as Won't Fix and lock`",
    ].join("\\n"),
};

/** 60 → "1-minute", 30 → "30-second". */
function duration(seconds: number): string {
  return seconds % 60 === 0 ? `${seconds / 60}-minute` : `${seconds}-second`;
}

function list(names: string[]): string {
  const bold = names.map((n) => `**${n}**`);
  return bold.length <= 1 ? bold.join("") : `${bold.slice(0, -1).join(", ")} and ${bold.at(-1)}`;
}
