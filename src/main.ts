import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { Octokit } from "@octokit/rest";

/**
 * Tests the `@actions/github` and `@octokit/rest` libraries.
 */
export async function run() {
  const tokenName = core.getInput("token_name", { required: true });
  const token = core.getInput("token", { required: true });

  const clients = {
    Actions: getOctokit(token), // `@actions/github`
    Octokit: new Octokit({ auth: token }), // `@octokit/rest`
  };

  const endpoints = {
    Current: "/orgs/{org}/teams/{team_slug}/memberships/{username}",
    Legacy: "/teams/{team_id}/memberships/{username}",
  };

  const teams = {
    Member: "i-am-a-member",
    NotMember: "i-am-not-a-member",
  };

  for (const [clientName, client] of Object.entries(clients)) {
    for (const [endpointName, endpoint] of Object.entries(endpoints)) {
      for (const [teamName, team] of Object.entries(teams)) {
        try {
          const response = await client.request(`GET ${endpoint}`, {
            org: "ncalteen-avocado",
            team_slug: team,
            username: "ncalteen",
          });

          core.info(JSON.stringify(response));
          core.info(
            `| ${tokenName} | ${clientName} | ${endpointName} | ${teamName} | ${
              teamName === "Member" ? `200` : `404`
            } | \`200\` |`
          );
        } catch (error: any) {
          core.error(JSON.stringify(error));
          if (error.status === 404) {
            core.info(
              `| ${tokenName} | ${clientName} | ${endpointName} | ${teamName} | ${
                teamName === "Member" ? `200` : `404`
              } | \`404\` |`
            );
          } else {
            throw error;
          }
        }
      }
    }
  }
}
