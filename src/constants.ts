import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000

export const CLI_USERNAME = process.env.GITHUB_USERNAME;
export const ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

export const ORG_NAME = 'Clipboard-recruiting';
export const TEAM_ID = 'backend-take-home-challenge';

export const TEMPLATE_REPO = 'candidate-sse-take-home-challenge-template';
export const TEMPLATE_REPO_URL =
  'github.com/Clipboard-recruiting/candidate-sse-take-home-challenge-template.git';
export const TEMPLATE_MAIN_BRANCH = 'main';

export const REPO_PREFIX = 'candidate-sse-take-home-challenge';

export const GIT_CLONE_URL = `https://${CLI_USERNAME}:${ACCESS_TOKEN}@github.com/${ORG_NAME}/${TEMPLATE_REPO}.git`;
export const GIT_PUSH_URL_BASE = `https://${CLI_USERNAME}:${ACCESS_TOKEN}@github.com/${ORG_NAME}/`;

export const TEMP_DIR = 'temp';
