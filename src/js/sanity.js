import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client configuration
const client = createClient({
  projectId: 'li8wy5y0',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01'
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// Fetch profile data
export async function getProfile() {
  const query = `*[_type == "profile"][0]{
    name,
    catchphrase,
    introduction,
    profileImage,
    links[]{
      title,
      url,
      platform,
      icon
    }
  }`
  
  return await client.fetch(query)
}

// Fetch popular articles
export async function getPopularArticles() {
  const query = `*[_type == "article" && isPopular == true] | order(order asc){
    title,
    url,
    thumbnail,
    platform
  }`
  
  return await client.fetch(query)
}

// Fetch recent articles (新着記事を取得)
export async function getRecentArticles(limit = 6) {
  const query = `*[_type == "article"] | order(publishedAt desc)[0...${limit}]{
    title,
    url,
    thumbnail,
    platform,
    publishedAt,
    "publishedDate": publishedAt
  }`
  
  return await client.fetch(query)
}

export default client