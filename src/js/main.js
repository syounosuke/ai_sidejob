import { getProfile, getPopularArticles, urlFor } from './sanity.js'

// DOM elements
const profileImage = document.querySelector('.profile-image')
const profileName = document.querySelector('.profile h1')
const catchphrase = document.querySelector('.catchphrase')
const introduction = document.querySelector('.introduction')
const linksContainer = document.querySelector('.links')
const articlesContainer = document.querySelector('.articles-container')

// Load profile data
async function loadProfile() {
  try {
    const profile = await getProfile()
    
    if (profile) {
      // Update profile image
      if (profile.profileImage) {
        profileImage.src = urlFor(profile.profileImage).width(260).height(260).url()
        profileImage.alt = `${profile.name}のプロフィール画像`
      }
      
      // Update text content
      profileName.textContent = profile.name
      catchphrase.textContent = profile.catchphrase
      introduction.innerHTML = profile.introduction.replace(/\n/g, '<br>')
      
      // Update links
      if (profile.links && profile.links.length > 0) {
        linksContainer.innerHTML = ''
        
        profile.links.forEach((link, index) => {
          const linkElement = document.createElement('a')
          linkElement.href = link.url
          linkElement.target = '_blank'
          linkElement.rel = 'noopener noreferrer'
          linkElement.className = `link-button ${link.platform} animated-item`
          linkElement.style.setProperty('--animation-delay', `${0.5 + index * 0.1}s`)
          
          linkElement.innerHTML = `
            <i class="${link.icon}"></i>
            <span>${link.title}</span>
          `
          
          linksContainer.appendChild(linkElement)
        })
      }
    }
  } catch (error) {
    console.error('プロフィール データの読み込みに失敗しました:', error)
  }
}

// Load popular articles
async function loadPopularArticles() {
  try {
    const articles = await getPopularArticles()
    
    if (articles && articles.length > 0) {
      articlesContainer.innerHTML = ''
      
      articles.forEach(article => {
        const articleElement = document.createElement('article')
        articleElement.className = 'article-card'
        
        const thumbnailUrl = article.thumbnail 
          ? urlFor(article.thumbnail).width(800).height(400).url()
          : ''
        
        articleElement.innerHTML = `
          <a href="${article.url}" target="_blank" rel="noopener noreferrer">
            ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${article.title}のサムネイル">` : ''}
            <p>${article.title}</p>
          </a>
        `
        
        articlesContainer.appendChild(articleElement)
      })
    }
  } catch (error) {
    console.error('記事データの読み込みに失敗しました:', error)
    // Fallback to existing HTML content if Sanity fails
  }
}

// Initialize the page
async function init() {
  await Promise.all([
    loadProfile(),
    loadPopularArticles()
  ])
}

// Load data when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}