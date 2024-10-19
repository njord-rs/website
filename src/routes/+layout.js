import { browser } from '$app/environment';
import { getRepoStats } from '../services/github';

export const prerender = true;

export const load = async () => {
  const repo = browser ? await getRepoStats() : {};

  return {
    repo,
  };
};
