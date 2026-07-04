import assert from 'node:assert/strict'
import test from 'node:test'
import { replaceImagePaths } from './replace-image-paths'

const repoInfo = {
  owner: 'example',
  repo: 'tech-blog',
  branch: 'main',
}

test('replaces Zenn image paths with stable GitHub URLs', () => {
  const input = [
    '![](/images/article/plain.png)',
    '![説明](/images/article/with-alt.png)',
    '![幅指定](/images/article/sized.png =320x)',
  ].join('\n')

  assert.equal(
    replaceImagePaths(input, repoInfo),
    [
      '![](https://raw.githubusercontent.com/example/tech-blog/main/images/article/plain.png)',
      '![説明](https://raw.githubusercontent.com/example/tech-blog/main/images/article/with-alt.png)',
      '![幅指定](https://raw.githubusercontent.com/example/tech-blog/main/images/article/sized.png =320x)',
    ].join('\n'),
  )
})

test('does not replace image examples inside fenced code blocks', () => {
  const input = ['```md', '![](/images/example.png)', '```'].join('\n')

  assert.equal(replaceImagePaths(input, repoInfo), input)
})
