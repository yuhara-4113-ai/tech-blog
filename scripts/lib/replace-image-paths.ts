import { execSync } from 'child_process'
import GitUrlParse from 'git-url-parse'

export interface RepoInfo {
  owner: string
  repo: string
  branch: string
}

function getDefaultBranch() {
  try {
    const remoteHead = execSync(
      'git symbolic-ref --short refs/remotes/origin/HEAD',
    )
      .toString()
      .trim()
    return remoteHead.replace(/^origin\//, '')
  } catch {
    return 'main'
  }
}

function getRemoteUrl() {
  return execSync('git config --get remote.origin.url').toString().trim()
}

function getRepoInfo(): RepoInfo {
  const gitInfo = GitUrlParse(getRemoteUrl())
  return {
    owner: gitInfo.owner,
    repo: gitInfo.name,
    branch: getDefaultBranch(),
  }
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function replaceImagePaths(
  inputContent: string,
  repoInfo = getRepoInfo(),
): string {
  const { owner, repo, branch } = repoInfo
  const githubRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`

  // Split by code blocks
  const parts = inputContent.split(/(```.*?```)/gs)

  // Only replace image paths outside of code blocks
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i].startsWith('```')) {
      parts[i] = parts[i].replace(
        /!\[([^\]]*)\]\((\/images\/[^)\s]+)(?:\s+=(\d*)x(\d*))?\)/g,
        (_match, alt: string, path: string, width: string, height: string) => {
          const url = `${githubRawUrl}${path}`
          if (width || height) {
            const widthAttribute = width ? ` width="${width}"` : ''
            const heightAttribute = height ? ` height="${height}"` : ''
            return `<img src="${escapeHtmlAttribute(url)}" alt="${escapeHtmlAttribute(alt)}"${widthAttribute}${heightAttribute}>`
          }
          return `![${alt}](${url})`
        },
      )
    }
  }

  // Rejoin the markdown
  return parts.join('')
}
