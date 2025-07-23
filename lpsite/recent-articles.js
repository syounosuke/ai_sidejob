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

function urlFor(source) {
  return builder.image(source)
}

// DOM elements
const articlesGrid = document.getElementById('articles-grid')
const loadMoreBtn = document.getElementById('load-more-btn')
const filterBtns = document.querySelectorAll('.filter-btn')
const mobileToggle = document.querySelector('.mobile-menu-toggle')
const navLinks = document.querySelector('.nav-links')

// State management
let currentFilter = 'all'
let currentPage = 0
const articlesPerPage = 9
let allArticles = []
let filteredArticles = []
let isLoading = false

// Fetch articles from Sanity
async function fetchArticles() {
  try {
    console.log('記事データを取得中...')
    
    // 直接fetch APIを使用してPOSTリクエスト
    const query = `*[_type == "article"] | order(publishedAt desc){title,url,thumbnail,platform,publishedAt}`
    
    console.log('使用するクエリ:', query)
    
    const response = await fetch('https://li8wy5y0.api.sanity.io/v2024-01-01/data/query/production', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    const articles = data.result || []
    
    console.log('取得された記事数:', articles.length)
    console.log('記事データ:', articles)
    return articles
  } catch (error) {
    console.error('記事データの取得に失敗しました:', error)
    console.error('エラー詳細:', error.message)
    
    // フォールバック: Sanity clientを試す
    try {
      console.log('フォールバック: Sanity clientを試行中...')
      const query = `*[_type == "article"]{title,url,platform,publishedAt}`
      const articles = await client.fetch(query)
      console.log('フォールバック成功:', articles.length + '件')
      return articles || []
    } catch (fallbackError) {
      console.error('フォールバックも失敗:', fallbackError)
      throw error
    }
  }
}

// Create article card element
function createArticleCard(article, index) {
  const articleElement = document.createElement('article')
  articleElement.className = 'article-card'
  articleElement.style.animationDelay = `${index * 0.1}s`
  
  const thumbnailUrl = article.thumbnail 
    ? urlFor(article.thumbnail).width(500).height(300).url()
    : ''
  
  // Format the published date
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Platform badge
  const platformBadge = article.platform === 'blog' ? 'Blog' : 'Note'
  const platformClass = article.platform === 'blog' ? 'platform-blog' : 'platform-note'
  
  articleElement.innerHTML = `
    <a href="${article.url}" target="_blank" rel="noopener noreferrer">
      <div class="article-image">
        ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${article.title}のサムネイル" loading="lazy">` : ''}
        <span class="platform-badge ${platformClass}">${platformBadge}</span>
      </div>
      <div class="article-content">
        <h3>${article.title}</h3>
        <time class="published-date">
          <i class="fas fa-calendar-alt"></i>
          ${publishedDate}
        </time>
      </div>
    </a>
  `
  
  return articleElement
}

// Filter articles based on platform
function filterArticles(platform) {
  if (platform === 'all') {
    filteredArticles = [...allArticles]
  } else {
    filteredArticles = allArticles.filter(article => article.platform === platform)
  }
  currentPage = 0
}

// Render articles
function renderArticles(append = false) {
  if (!append) {
    articlesGrid.innerHTML = ''
  }
  
  const startIndex = currentPage * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const articlesToRender = filteredArticles.slice(startIndex, endIndex)
  
  if (articlesToRender.length === 0) {
    if (!append) {
      articlesGrid.innerHTML = '<div class="no-articles">該当する記事がありません</div>'
    }
    loadMoreBtn.style.display = 'none'
    return
  }
  
  articlesToRender.forEach((article, index) => {
    const articleCard = createArticleCard(article, append ? index : startIndex + index)
    articlesGrid.appendChild(articleCard)
  })
  
  // Show/hide load more button
  const hasMoreArticles = endIndex < filteredArticles.length
  loadMoreBtn.style.display = hasMoreArticles ? 'block' : 'none'
  
  currentPage++
}

// Load initial articles
async function loadArticles() {
  try {
    isLoading = true
    articlesGrid.innerHTML = `
      <div class="loading-message">
        <i class="fas fa-spinner fa-spin"></i>
        <span>記事を読み込み中...</span>
      </div>
    `
    
    // タイムアウト処理（10秒）
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('タイムアウト: 記事の読み込みに時間がかかりすぎています')), 10000)
    )
    
    allArticles = await Promise.race([fetchArticles(), timeoutPromise])
    console.log('記事読み込み完了:', allArticles.length + '件')
    
    filterArticles(currentFilter)
    renderArticles()
    
  } catch (error) {
    console.error('記事の読み込みに失敗しました:', error)
    articlesGrid.innerHTML = `
      <div class="error-message">
        記事の読み込みに失敗しました<br>
        <small>${error.message}</small><br><br>
        <button onclick="location.reload()" style="padding: 10px 20px; background: var(--color-accent); color: var(--bg-grad-start); border: none; border-radius: 5px; cursor: pointer;">
          再読み込み
        </button>
      </div>
    `
  } finally {
    isLoading = false
  }
}

// Load more articles
function loadMoreArticles() {
  if (isLoading) return
  
  isLoading = true
  loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 読み込み中...'
  
  setTimeout(() => {
    renderArticles(true)
    loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> さらに読み込む'
    isLoading = false
  }, 500) // Simulate loading delay
}

// Handle filter button clicks
function handleFilterClick(e) {
  if (isLoading) return
  
  const button = e.target
  const filter = button.dataset.filter
  
  // Update active state
  filterBtns.forEach(btn => btn.classList.remove('active'))
  button.classList.add('active')
  
  // Apply filter
  currentFilter = filter
  filterArticles(filter)
  renderArticles()
}

// Mobile menu functionality
function initMobileMenu() {
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active')
      navLinks.classList.toggle('active')
    })
    
    // Close menu when clicking on a link
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && !e.target.getAttribute('href').startsWith('http')) {
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

// Smooth scrolling for anchor links
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

// Event listeners
function initEventListeners() {
  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', handleFilterClick)
  })
  
  // Load more button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreArticles)
  }
  
  // Mobile menu
  initMobileMenu()
  
  // Smooth scrolling
  initSmoothScrolling()
}

// Initialize the page
async function init() {
  initEventListeners()
  await loadArticles()
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  // Reset to default state when navigating back
  currentFilter = 'all'
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === 'all')
  })
  filterArticles('all')
  renderArticles()
})

// Intersection Observer for lazy loading animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running'
    }
  })
}, observerOptions)

// Observe new article cards when they're added
const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1 && node.classList.contains('article-card')) {
        observer.observe(node)
      }
    })
  })
})

// Start observing the articles grid
if (articlesGrid) {
  mutationObserver.observe(articlesGrid, { childList: true })
}