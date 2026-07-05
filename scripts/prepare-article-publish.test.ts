import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import matter from 'gray-matter'
import { prepareArticlePublish } from './prepare-article-publish'

function createArticleRoot() {
  const rootDir = mkdtempSync(join(tmpdir(), 'publish-article-'))
  mkdirSync(join(rootDir, 'articles'))
  mkdirSync(join(rootDir, 'qiita', 'public'), { recursive: true })
  return rootDir
}

test('prepares one Zenn and Qiita article for publication', () => {
  const rootDir = createArticleRoot()
  const slug = 'sample-article'
  const zennPath = join(rootDir, 'articles', `${slug}.md`)
  const qiitaPath = join(rootDir, 'qiita', 'public', `${slug}.md`)

  writeFileSync(
    zennPath,
    `---
title: サンプル
emoji: 🚀
type: tech
topics: [Zenn, Qiita]
published: false
---

本文
`,
  )
  writeFileSync(
    qiitaPath,
    `---
title: サンプル
tags: [Zenn, Qiita]
private: true
updated_at: '2026-07-06T00:00:00+09:00'
id: article-id
organization_url_name: null
slide: false
ignorePublish: false
posting_campaign_uuid: null
agreed_posting_campaign_term: false
---

本文
`,
  )

  prepareArticlePublish(slug, rootDir)

  const zenn = matter(readFileSync(zennPath, 'utf8'))
  const qiita = matter(readFileSync(qiitaPath, 'utf8'))
  assert.equal(zenn.data.published, true)
  assert.equal(qiita.data.private, false)
  assert.equal(qiita.data.id, 'article-id')
  assert.equal(qiita.data.updated_at, '2026-07-06T00:00:00+09:00')
  assert.equal(qiita.content.trim(), '本文')
})

test('rejects a slug that can escape the article directories', () => {
  const rootDir = createArticleRoot()
  assert.throws(
    () => prepareArticlePublish('../article', rootDir),
    /小文字の英数字とハイフン/,
  )
})

test('requires a published field in the Zenn article', () => {
  const rootDir = createArticleRoot()
  const slug = 'sample-article'
  const zennPath = join(rootDir, 'articles', `${slug}.md`)
  writeFileSync(
    zennPath,
    `---
title: サンプル
emoji: 🚀
type: tech
topics: [Zenn]
---

本文
`,
  )

  assert.throws(
    () => prepareArticlePublish(slug, rootDir),
    /published設定が見つかりません/,
  )
})
