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

// Smooth scrolling for internal links only
function initSmoothScrolling() {
  // 完全に特定のリンクのみに限定
  const profileLink = document.querySelector('a[href="#profile"]')
  const linksLink = document.querySelector('a[href="#links"]')  
  const popularLink = document.querySelector('a[href="#popular-articles"]')
  
  if (profileLink) {
    profileLink.addEventListener('click', function (e) {
      e.preventDefault()
      document.querySelector('#profile')?.scrollIntoView({ behavior: 'smooth' })
    })
  }
  
  if (linksLink) {
    linksLink.addEventListener('click', function (e) {
      e.preventDefault()
      document.querySelector('#links')?.scrollIntoView({ behavior: 'smooth' })
    })
  }
  
  if (popularLink) {
    popularLink.addEventListener('click', function (e) {
      e.preventDefault()
      document.querySelector('#popular-articles')?.scrollIntoView({ behavior: 'smooth' })
    })
  }
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

// 直接テスト用関数
window.testSanityDirect = async function() {
  const newWindow = window.open('', '_blank')
  newWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>新着記事テスト</title>
      <style>
        body { background: #000; color: #fff; padding: 20px; font-family: Arial; }
        .step { padding: 10px; margin: 5px 0; background: #333; border-radius: 5px; }
        .success { background: #2a5d31 !important; }
        .error { background: #7d2d2d !important; }
      </style>
    </head>
    <body>
      <h1>新着記事テスト</h1>
      <div id="step1" class="step">1. HTML読み込み: ✅</div>
      <div id="step2" class="step">2. JavaScript開始: ❌</div>
      <div id="step3" class="step">3. データ取得テスト: ❌</div>
      <div id="result" style="margin-top:20px; padding:20px; background:#222; border-radius:10px;">結果待機中...</div>
      <script>
        document.getElementById('step2').innerHTML = '2. JavaScript開始: ✅';
        document.getElementById('step2').className = 'step success';
        
        async function test() {
          try {
            document.getElementById('result').innerHTML = '🔄 テスト中...';
            
            const response = await fetch('https://li8wy5y0.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="article"][0]{title}');
            
            if (response.ok) {
              const data = await response.json();
              document.getElementById('step3').innerHTML = '3. データ取得テスト: ✅';
              document.getElementById('step3').className = 'step success';
              document.getElementById('result').innerHTML = '✅ 成功! データ: <pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } else {
              throw new Error('HTTP ' + response.status);
            }
          } catch(e) {
            document.getElementById('step3').innerHTML = '3. データ取得テスト: ❌ ' + e.message;
            document.getElementById('step3').className = 'step error';
            document.getElementById('result').innerHTML = '❌ エラー: ' + e.message;
          }
        }
        
        setTimeout(test, 1000);
      </script>
    </body>
    </html>
  `)
  newWindow.document.close()
}