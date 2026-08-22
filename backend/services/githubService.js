const { Octokit } = require('@octokit/rest');

function getOctokit(token) {
  const authToken = token || process.env.GITHUB_TOKEN;
  return new Octokit({
    auth: authToken || undefined,
    userAgent: 'ProjectTwin-GitHubApp/1.0'
  });
}

/**
 * Fetch real repository metadata from GitHub REST API
 */
async function getRepository(owner, repo, token) {
  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.rest.repos.get({ owner, repo });
    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        defaultBranch: data.default_branch,
        visibility: data.private ? 'private' : 'public',
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        htmlUrl: data.html_url
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to fetch repository from GitHub.'
    };
  }
}

/**
 * Create a new branch ref on GitHub
 */
async function createBranch(owner, repo, newBranch, baseBranch = 'main', token) {
  try {
    const octokit = getOctokit(token);
    const refData = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${baseBranch}` });
    const sha = refData.data.object.sha;

    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`,
      sha
    });

    return { success: true, branch: newBranch, sha };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to create branch on GitHub.' };
  }
}

/**
 * Create a real Pull Request on GitHub
 */
async function createPullRequest({ owner, repo, title, body, head, base = 'main', token }) {
  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.rest.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base
    });

    return {
      success: true,
      pullRequest: {
        number: data.number,
        htmlUrl: data.html_url,
        state: data.state,
        title: data.title,
        user: data.user.login,
        createdAt: data.created_at
      }
    };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to create Pull Request on GitHub.' };
  }
}

/**
 * Merge a Pull Request on GitHub
 */
async function mergePullRequest({ owner, repo, pullNumber, commitTitle, mergeMethod = 'merge', token }) {
  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.rest.pulls.merge({
      owner,
      repo,
      pull_number: pullNumber,
      commit_title: commitTitle,
      merge_method: mergeMethod
    });

    return {
      success: true,
      merged: data.merged,
      message: data.message,
      sha: data.sha
    };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to merge Pull Request on GitHub.' };
  }
}

module.exports = {
  getOctokit,
  getRepository,
  createBranch,
  createPullRequest,
  mergePullRequest
};
