import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import {
  ACCESS_TOKEN,
  ORG_NAME,
  TEMPLATE_MAIN_BRANCH,
  REPO_PREFIX,
  TEAM_ID,
} from '../constants';

export interface Repo {
  id: string;
  name: string;
  archived: boolean;
  html_url: string;
  private: boolean;
  invites?: Collaborator[];
  collaborators?: Collaborator[];
}

interface Collaborator {
  id: string;
  login: string;
  role_name?: string;
}

/************ Utils ************/
function formatRepo(githubRepo): Repo {
  const { id, name, html_url, archived } = githubRepo;
  return {
    id,
    name,
    // Can't follow the normal destructuring patten here because
    // 'private' is a reserved keyword & throws a ts compilation error
    private: githubRepo.private,
    html_url,
    archived,
  };
}

function formatCollaborator(githubCollaborator): Collaborator {
  const { id, login, role_name } = githubCollaborator;
  return {
    id,
    login,
    role_name,
  };
}

function formatInvite(githubInvite): Collaborator {
  return formatCollaborator(githubInvite.invitee);
}

function isCandidatePrReviewRepo(repo) {
  const hasCandidatePrReviewNaming = repo.name.includes(
    REPO_PREFIX,
  );
  const isTemplate =
    repo.name.includes('template') || repo.name.includes('base');

  return hasCandidatePrReviewNaming && !isTemplate;
}

@Injectable()
export class GithubApiService {
  octokit = new Octokit({
    auth: ACCESS_TOKEN,
  });

  repos = {
    octokit: this.octokit,
    async create(repoName): Promise<Repo> {
      const response = await this.octokit.rest.repos.createInOrg({
        org: ORG_NAME,
        name: repoName,
        private: true,
      });

      return formatRepo(response.data);
    },
    async archive(repoName) {
      const response = await this.octokit.rest.repos.update({
        owner: ORG_NAME,
        repo: repoName,
        archived: true,
      });

      return formatRepo(response.data);
    },
    async listInterviewRepos() {
      const response = await this.octokit.rest.repos.listForOrg({
        org: ORG_NAME,
        sort: 'created_at',
        direction: 'desc',
        per_page: 100,
      });
      const repos = response.data;
      const candidatePrReviewRepos = repos.filter((repo) =>
        isCandidatePrReviewRepo(repo),
      );
      return candidatePrReviewRepos.map((repo) => formatRepo(repo));
    },
  };

  collaborators = {
    octokit: this.octokit,
    async invite(repoName, collaboratorUsername) {
      const response = await this.octokit.rest.repos.addCollaborator({
        owner: ORG_NAME,
        repo: repoName,
        username: collaboratorUsername,
      });

      const invitee = response.data.invitee;
      return formatCollaborator(invitee);
    },
    async remove(repoName, collaboratorUsername) {
      await this.octokit.rest.repos.removeCollaborator({
        owner: ORG_NAME,
        repo: repoName,
        username: collaboratorUsername,
      });
    },
    async list(repoName) {
      const response = await this.octokit.rest.repos.listCollaborators({
        owner: ORG_NAME,
        repo: repoName,
        affiliation: 'outside',
      });

      return response.data.map((collaborator) =>
        formatCollaborator(collaborator),
      );
    },
    async addRepoToTeam(repoName) {
      await this.octokit.rest.teams.addOrUpdateRepoPermissionsInOrg({
        org: ORG_NAME,
        owner: ORG_NAME,
        repo: repoName,
        team_slug: TEAM_ID,
        permission: 'maintain',
      });
    },
  };

  invites = {
    octokit: this.octokit,
    async list(repoName) {
      const response = await this.octokit.rest.repos.listInvitations({
        owner: ORG_NAME,
        repo: repoName,
      });

      const invites = response.data;
      return invites.map((invite) => formatInvite(invite));
    },
  };
}
