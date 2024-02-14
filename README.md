# Org Team Membership Testing

The purpose of this repository is to reproduce an error I encountered when building an action that checked to see if a user is a member of a particular team.

During testing, I created two GitHub Apps that had different permissions set for the Organization -> [Members](https://docs.github.com/en/rest/authentication/permissions-required-for-github-apps?apiVersion=2022-11-28#organization-permissions-for-members) scope.

- The first app had read-only permissions to Members.
- The second app had read-write permissions to Members.
- I also tested with the workflow token, `${{ secrets.GITHUB_TOKEN }}`.

Tests were conducted with the different permutations of the following:

Client:

- **Actions:** `@actions/github`
- **Octokit:** `@octokit/rest`
- **Script:** The built-in `github` client in [`actions/github-script`](https://github.com/actions/github-script) steps

Token:

- **Read:** The read-only app token, generated via [`actions/create-github-app-token`](https://github.com/actions/create-github-app-token)
- **ReadWrite:** The read-write app token[`actions/create-github-app-token`](https://github.com/actions/create-github-app-token)
- **Workflow:** The built-in workflow token, `${{ secrets.GITHUB_TOKEN }}`.

Endpoint:

- **Current:** [`/orgs/{org}/teams/{team_slug}/memberships/{username}`](https://docs.github.com/en/rest/teams/members?apiVersion=2022-11-28#get-team-membership-for-a-user)
- **Legacy:** [`/teams/{team_id}/memberships/{username}`](https://docs.github.com/en/rest/teams/members?apiVersion=2022-11-28#get-team-membership-for-a-user-legacy)

Teams:

- **Member:** [`@ncalteen-avocado/i-am-a-member`](https://github.com/orgs/ncalteen-avocado/teams/i-am-a-member)
- **NotMember:** [`@ncalteen-avocado/i-am-not-a-member`](https://github.com/orgs/ncalteen-avocado/teams/i-am-not-a-member/members)

| Token     | Client  | Endpoint | Team      | Expected Result | Actual Result |
| --------- | ------- | -------- | --------- | --------------- | ------------- |
| Read      | Actions | Current  | Member    | `200`           | `200`         |
| Read      | Actions | Current  | NotMember | `404`           | `404`         |
| Read      | Actions | Legacy   | Member    | `200`           | `404` (:x:)   |
| Read      | Actions | Legacy   | NotMember | `404`           | `404`         |
| Read      | Octokit | Current  | Member    | `200`           | `200`         |
| Read      | Octokit | Current  | NotMember | `404`           | `404`         |
| Read      | Octokit | Legacy   | Member    | `200`           | `404` (:x:)   |
| Read      | Octokit | Legacy   | NotMember | `404`           | `404`         |
| Read      | Script  | Current  | Member    | `200`           |               |
| Read      | Script  | Current  | NotMember | `404`           |               |
| Read      | Script  | Legacy   | Member    | `200`           |               |
| Read      | Script  | Legacy   | NotMember | `404`           |               |
| ReadWrite | Actions | Current  | Member    | `200`           | `200`         |
| ReadWrite | Actions | Current  | NotMember | `404`           | `404`         |
| ReadWrite | Actions | Legacy   | Member    | `200`           | `404` (:x:)   |
| ReadWrite | Actions | Legacy   | NotMember | `404`           | `404`         |
| ReadWrite | Octokit | Current  | Member    | `200`           | `200`         |
| ReadWrite | Octokit | Current  | NotMember | `404`           | `404`         |
| ReadWrite | Octokit | Legacy   | Member    | `200`           | `404` (:x:)   |
| ReadWrite | Octokit | Legacy   | NotMember | `404`           | `404`         |
| ReadWrite | Script  | Current  | Member    | `200`           |               |
| ReadWrite | Script  | Current  | NotMember | `404`           |               |
| ReadWrite | Script  | Legacy   | Member    | `200`           |               |
| ReadWrite | Script  | Legacy   | NotMember | `404`           |               |
| Workflow  | Actions | Current  | Member    | `200`           |               |
| Workflow  | Actions | Current  | NotMember | `404`           |               |
| Workflow  | Actions | Legacy   | Member    | `200`           |               |
| Workflow  | Actions | Legacy   | NotMember | `404`           |               |
| Workflow  | Octokit | Current  | Member    | `200`           |               |
| Workflow  | Octokit | Current  | NotMember | `404`           |               |
| Workflow  | Octokit | Legacy   | Member    | `200`           |               |
| Workflow  | Octokit | Legacy   | NotMember | `404`           |               |
| Workflow  | Script  | Current  | Member    | `200`           |               |
| Workflow  | Script  | Current  | NotMember | `404`           |               |
| Workflow  | Script  | Legacy   | Member    | `200`           |               |
| Workflow  | Script  | Legacy   | NotMember | `404`           |               |
