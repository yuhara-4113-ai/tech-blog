import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { zennMarkdownToQiitaMarkdown } from './lib'

const slugPattern = /^[a-z0-9][a-z0-9-]*$/
const frontMatterPattern = /^(---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))/
const publishedPattern = /^published:\s*(true|false)\s*$/m

export function prepareArticlePublish(slug: string, rootDir = process.cwd()) {
  if (!slugPattern.test(slug)) {
    throw new Error('slugには小文字の英数字とハイフンだけを指定してください')
  }

  const zennPath = resolve(rootDir, 'articles', `${slug}.md`)
  const qiitaPath = resolve(rootDir, 'qiita', 'public', `${slug}.md`)

  if (!existsSync(zennPath)) {
    throw new Error(`Zenn記事が見つかりません: articles/${slug}.md`)
  }

  const zennContent = readFileSync(zennPath, 'utf8')
  const frontMatterMatch = zennContent.match(frontMatterPattern)
  if (!frontMatterMatch) {
    throw new Error(`Front Matterが見つかりません: articles/${slug}.md`)
  }

  const frontMatter = frontMatterMatch[2]
  if (!publishedPattern.test(frontMatter)) {
    throw new Error(`published設定が見つかりません: articles/${slug}.md`)
  }

  const publishedFrontMatter = frontMatter.replace(
    publishedPattern,
    'published: true',
  )
  const publishedZennContent =
    frontMatterMatch[1] +
    publishedFrontMatter +
    frontMatterMatch[3] +
    zennContent.slice(frontMatterMatch[0].length)
  const publishedQiitaContent = zennMarkdownToQiitaMarkdown(
    publishedZennContent,
    qiitaPath,
  )

  writeFileSync(zennPath, publishedZennContent, 'utf8')
  writeFileSync(qiitaPath, publishedQiitaContent, 'utf8')

  return { qiitaPath, zennPath }
}

function main() {
  const slug = process.argv[2]
  if (!slug) {
    throw new Error('公開する記事のslugを指定してください')
  }

  const { qiitaPath, zennPath } = prepareArticlePublish(slug)
  console.log(`Prepared Zenn article: ${zennPath}`)
  console.log(`Prepared Qiita article: ${qiitaPath}`)
}

if (require.main === module) {
  main()
}
