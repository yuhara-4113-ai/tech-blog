import { existsSync, readFileSync } from 'fs'
import matter from 'gray-matter'
import yaml from 'js-yaml'

export function convertFrontmatter(outputPath?: string) {
  return function _convertFrontmatter(inputContent: string) {
    const { data, content } = matter(inputContent)
    const dataCloned = { ...data }

    // Remove unnecessary fields
    delete dataCloned.emoji
    delete dataCloned.type

    // Convert published to private (reversed)
    dataCloned.private = !dataCloned.published
    delete dataCloned.published

    // Convert topics to tags
    dataCloned.tags = dataCloned.topics
    delete dataCloned.topics

    // Preserve fields managed by Qiita CLI when regenerating an existing article.
    const existingData =
      outputPath && existsSync(outputPath)
        ? matter(readFileSync(outputPath, 'utf8')).data
        : {}
    dataCloned.updated_at = existingData.updated_at ?? ''
    dataCloned.id = existingData.id ?? null
    dataCloned.organization_url_name =
      existingData.organization_url_name ?? null
    dataCloned.slide = existingData.slide ?? false
    dataCloned.ignorePublish = existingData.ignorePublish ?? false
    dataCloned.posting_campaign_uuid =
      existingData.posting_campaign_uuid ?? null
    dataCloned.agreed_posting_campaign_term =
      existingData.agreed_posting_campaign_term ?? false

    const frontmatter = yaml.dump(dataCloned)
    return `---\n${frontmatter}---\n${content}`
  }
}
