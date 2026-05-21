import { Buffer } from 'buffer';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
if (!LINEAR_API_KEY) {
  console.error("LINEAR_API_KEY is missing");
  process.exit(1);
}

const COMMIT_HASH = "1fba698937bf6780bf03261175ad62177a11d51e";
const COMMENT_BODY = `Revised source mix now includes Google Play data.
Commit: ${COMMIT_HASH}
Caveat: In fallback rows, app_name might be the package ID. Next action: Enrichment script for name normalization.`;

async function main() {
  // 1. Get Issue ID
  const issueQuery = {
    query: `query { issue(id: "RES-1") { id } }`
  };

  const issueResponse = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": LINEAR_API_KEY
    },
    body: JSON.stringify(issueQuery)
  });

  const issueData = await issueResponse.json();
  const issueUuid = issueData.data?.issue?.id;

  if (!issueUuid) {
    console.error("Could not find issue RES-1:", JSON.stringify(issueData));
    process.exit(1);
  }

  // 2. Create Comment
  const commentMutation = {
    query: `mutation($issueId: String!, $body: String!) {
      commentCreate(input: { issueId: $issueId, body: $body }) {
        success
        comment {
          url
        }
      }
    }`,
    variables: {
      issueId: issueUuid,
      body: COMMENT_BODY
    }
  };

  const commentResponse = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": LINEAR_API_KEY
    },
    body: JSON.stringify(commentMutation)
  });

  const commentData = await commentResponse.json();
  if (commentData.data?.commentCreate?.success) {
    console.log("Success: true");
    console.log("URL: " + commentData.data.commentCreate.comment.url);
  } else {
    console.error("Failed to create comment:", JSON.stringify(commentData));
    process.exit(1);
  }
}

main().catch(console.error);
