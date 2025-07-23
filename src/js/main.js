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

// Mobile menu functionality
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle')
  const navLinks = document.querySelector('.nav-links')
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active')
      navLinks.classList.toggle('active')
    })
    
    // Close menu when clicking on a link
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        mobileToggle.classList.remove('active')
        navLinks.classList.remove('active')
      }
    })
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        mobileToggle.classList.remove('active')
        navLinks.classList.remove('active')
      }
    })
  }
}

// Smooth scrolling for internal links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
}

// Load data when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init()
    initMobileMenu()
    initSmoothScrolling()
  })
} else {
  init()
  initMobileMenu()
  initSmoothScrolling()
}