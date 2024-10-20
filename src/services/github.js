import { Octokit } from '@octokit/rest';
import dayjs from 'dayjs';

import { createLocalStorageCache } from '../utils/cache';

const GITHUB_CACHE_KEY = 'github';
const GITHUB_CACHE_TTL = 1000 * 60 * 60; // Cache ttl 1 hour

const endpoint = '/repos/njord-rs/njord';
const repoPath = 'https://github.com/njord-rs/njord';

const octokit = new Octokit();
const githubCache = createLocalStorageCache();

export async function getRepoStats() {
  try {
    if (githubCache.has(GITHUB_CACHE_KEY)) {
      return githubCache.get(GITHUB_CACHE_KEY);
    }

    const [stars, commits, contributors] = await Promise.all([
      getStars(),
      getCommits(),
      getContributors(),
    ]);

    const stargazers = { stars, path: `${repoPath}/stargazers` };

    const latestVersion = {
      version: '0.4.0-alpha',
      path: `${repoPath}/releases`,
    };

    const latestCommit = {
      path: `${repoPath}/commit/${commits[0].sha}`,
      date: dayjs(commits[0].commit.author.date).format('MM/DD/YY'),
    };

    const data = { stargazers, latestVersion, latestCommit, contributors };

    githubCache.set(GITHUB_CACHE_KEY, data, GITHUB_CACHE_TTL);

    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

async function getStars() {
  try {
    const { data } = await octokit.request(endpoint);

    return data.stargazers_count;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

//TODO: change version to the latest release with GitHub API later
// async function getLatestVersion() {
//   try {
//     const { data } = await octokit.request(`${endpoint}/releases`);
//     return data;
//   } catch (error) {
//     console.error(error);
//     return {};
//   }
// }

async function getCommits() {
  try {
    const { data } = await octokit.request(`${endpoint}/commits`);

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getContributors() {
  try {
    const { data } = await octokit.request(`${endpoint}/contributors`);

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
