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
    '![高さ指定](/images/article/tall.png =x240)',
    '![両方指定](/images/article/fixed.png =320x240)',
    '!["引用" & 記号](/images/article/escaped.png =100x)',
  ].join('\n')

  assert.equal(
    replaceImagePaths(input, repoInfo),
    [
      '![](https://raw.githubusercontent.com/example/tech-blog/main/images/article/plain.png)',
      '![説明](https://raw.githubusercontent.com/example/tech-blog/main/images/article/with-alt.png)',
      '<img src="https://raw.githubusercontent.com/example/tech-blog/main/images/article/sized.png" alt="幅指定" width="320">',
      '<img src="https://raw.githubusercontent.com/example/tech-blog/main/images/article/tall.png" alt="高さ指定" height="240">',
      '<img src="https://raw.githubusercontent.com/example/tech-blog/main/images/article/fixed.png" alt="両方指定" width="320" height="240">',
      '<img src="https://raw.githubusercontent.com/example/tech-blog/main/images/article/escaped.png" alt="&quot;引用&quot; &amp; 記号" width="100">',
    ].join('\n'),
  )
})

test('does not replace image examples inside fenced code blocks', () => {
  const input = ['```md', '![](/images/example.png)', '```'].join('\n')

  assert.equal(replaceImagePaths(input, repoInfo), input)
})
