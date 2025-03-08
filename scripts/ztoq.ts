import {
  readFileSync,
  statSync,
  watchFile,
  writeFileSync,
  existsSync,
  mkdirSync,
} from 'fs'
import yargs from 'yargs'
import { zennMarkdownToQiitaMarkdown } from './lib'
import { basename, join, dirname } from 'path'

const { inputPath, watch } = yargs
  .command('* <inputPath>', 'convert Zenn markdown to Qiita markdown')
  .positional('inputPath', {
    describe: 'Zenn markdown filepath to convert',
    type: 'string',
    demandOption: true,
  })
  .option('watch', {
    describe: 'Watch for changes in the input file',
    alias: 'w',
    type: 'boolean',
    default: false,
  })
  .help()
  .alias('help', 'h')
  .parseSync()

// outputPathは固定のディレクトリとして設定（ここではqiita/publicを利用）
const outputPath = join(process.cwd(), 'qiita/public')

function convertAndWrite(inputPath: string, outputPath: string) {
  const inputContent = readFileSync(inputPath, 'utf8')
  const outputContent = zennMarkdownToQiitaMarkdown(inputContent, outputPath)
  writeFileSync(outputPath, outputContent, 'utf8')
}

function main() {
  // qiita/publicディレクトリが存在しなければ作成
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true })
  }
  // 入力ファイル名と同じ名前で出力先ファイルパスを作成
  const outputFilepath = join(outputPath, basename(inputPath))

  convertAndWrite(inputPath, outputFilepath)
  console.log(`Output written to ${outputFilepath}`)

  if (watch) {
    console.log('Watching for changes...')
    watchFile(inputPath, { persistent: true, interval: 1000 }, () => {
      console.log('Input file changed. Converting and writing output...')
      convertAndWrite(inputPath, outputFilepath)
      console.log(`Output written to ${outputFilepath}`)
    })
  }
}

main()
