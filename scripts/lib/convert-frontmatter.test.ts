import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import matter from 'gray-matter'
import { convertFrontmatter } from './convert-frontmatter'

const zennArticle = `---
title: テスト記事
emoji: 🚀
type: tech
topics:
  - Zenn
  - Qiita
published: true
---
本文
`

test('converts Zenn front matter to current Qiita fields', () => {
  const converted = convertFrontmatter()(zennArticle)
  const { data, content } = matter(converted)

  assert.deepEqual(data, {
    title: 'テスト記事',
    private: false,
    tags: ['Zenn', 'Qiita'],
    updated_at: '',
    id: null,
    organization_url_name: null,
    slide: false,
    ignorePublish: false,
    posting_campaign_uuid: null,
    agreed_posting_campaign_term: false,
  })
  assert.equal(content.trim(), '本文')
})

test('preserves fields managed by Qiita CLI', () => {
  const directory = mkdtempSync(join(tmpdir(), 'ztoq-'))
  const outputPath = join(directory, 'article.md')
  writeFileSync(
    outputPath,
    `---
title: old
tags: []
private: false
updated_at: '2026-07-04T00:00:00+09:00'
id: abc123
organization_url_name: example
slide: true
ignorePublish: true
posting_campaign_uuid: campaign-id
agreed_posting_campaign_term: true
---
old body
`,
  )

  const { data } = matter(convertFrontmatter(outputPath)(zennArticle))

  assert.equal(data.id, 'abc123')
  assert.equal(data.updated_at, '2026-07-04T00:00:00+09:00')
  assert.equal(data.organization_url_name, 'example')
  assert.equal(data.slide, true)
  assert.equal(data.ignorePublish, true)
  assert.equal(data.posting_campaign_uuid, 'campaign-id')
  assert.equal(data.agreed_posting_campaign_term, true)
})
