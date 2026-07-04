import assert from 'node:assert/strict'
import test from 'node:test'
import { replaceMessageToNote } from './replace-message-to-note'

test('converts Zenn message blocks to Qiita note blocks', () => {
  const input = `:::message
補足
:::

:::message alert
警告
:::`

  assert.equal(
    replaceMessageToNote(input),
    `:::note
補足
:::

:::note alert
警告
:::`,
  )
})
