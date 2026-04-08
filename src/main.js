import './style.css'
import logo from './assets/logo.jpg'

// Bot source rates (demo values - will be updated from sheet)
let botBuyRate = 129.87
let botSellRate = 133.33
let serviceFeePercent = 4

// History data (will be populated from Google Sheet)
let rateHistory = []

// Customer rates after service fee
let customerTHBtoMMK = (botBuyRate * 0.96).toFixed(2)   // THB → MMK = buy rate × 0.96
let customerMMKtoTHB = (botSellRate * 1.04).toFixed(2)  // MMK → THB = sell rate × 1.04

// Tiered fee structure
const feeTiers = [
  { min: 1, max: 1000, fee: 0.04 },      // 4%
  { min: 1001, max: 10000, fee: 0.03 },  // 3%
  { min: 10001, max: 999999, fee: 0.02 } // 2%
]

// Get fee based on amount
function getFeeForAmount(amount) {
  for (const tier of feeTiers) {
    if (amount >= tier.min && amount <= tier.max) {
      return tier.fee
    }
  }
  return 0.04 // default
}

// Calculator logic with tiered fees
function calculateTHBtoMMK(amount) {
  const fee = getFeeForAmount(amount)
  const rate = botBuyRate * (1 - fee)  // Buy rate minus fee
  return (amount * rate).toFixed(2)
}

function calculateMMKtoTHB(amount) {
  const fee = getFeeForAmount(amount)
  const rate = botSellRate * (1 + fee)  // Sell rate plus fee
  return (amount / rate).toFixed(2)
}

// Reverse calculations
function calculateMMKtoTHBfromTHB(amountTHB) {
  // If user entered THB, how much MMK they'd need to get that THB
  return (amountTHB * customerMMKtoTHB).toFixed(2)
}

function calculateTHBtoMMKfromMMK(amountMMK) {
  // If user entered MMK, how much THB they'd get for that MMK
  return (amountMMK / customerTHBtoMMK).toFixed(2)
}

// Copy to clipboard
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const original = button.textContent
    button.textContent = 'Copied!'
    button.style.background = '#169b45'
    setTimeout(() => {
      button.textContent = original
      button.style.background = ''
    }, 1500)
  })
}

// Build UI
document.querySelector('#app').innerHTML = `
  <header class="site-header">
    <div class="brand">
      <img src="${logo}" alt="Mahar Shwe Exchange Logo" class="brand-logo" />
      <div>
        <p class="eyebrow">Mahar Shwe</p>
        <h1>Mahar Shwe Exchange</h1>
      </div>
    </div>
    <nav class="top-nav">
      <a href="#rates">Rates</a>
      <a href="#calculator">Calculator</a>
      <a href="#announcement">Announcement</a>
      <a href="#bank-info">Bank Info</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main>
    <section class="hero-section">
      <div class="hero-copy">
        <p class="eyebrow">THB ↔ MMK Exchange Service</p>
        <h2>ဘတ်ဈေးကို နေ့စဉ် Update ပြသပေးမယ့် ငွေလွှဲဝန်ဆောင်မှု Website</h2>
        <p class="hero-text">
          Thailand Baht to Kyat နဲ့ Kyat to Baht ငွေလွှဲဝန်ဆောင်မှုအတွက် ယနေ့ဈေးနှုန်း၊
          ကြေညာချက်များနဲ့ ဆက်သွယ်ရန်အချက်အလက်တွေကို တစ်နေရာတည်းမှာ ကြည့်နိုင်မယ်။
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#calculator">ငွေလဲကြည့်မယ်</a>
          <a class="btn btn-secondary" href="https://t.me/Mylifemychoice68" target="_blank" rel="noreferrer">Telegram ဆက်သွယ်မယ်</a>
        </div>
      </div>
      <aside class="hero-card">
        <p class="card-label">ယနေ့ ဘတ်ဈေး</p>
        <p class="card-date">08-04-2026</p>
        <div class="rate-row">
          <span>ဝယ်ဈေး (Bot)</span>
          <strong>${botBuyRate} ကျပ်</strong>
        </div>
        <div class="rate-row">
          <span>ရောင်းဈေး (Bot)</span>
          <strong>${botSellRate} ကျပ်</strong>
        </div>
        <div class="rate-row highlight">
          <span>Service Fee</span>
          <strong>${serviceFeePercent}%</strong>
        </div>
        <p class="updated-time">Daily updated rate</p>
      </aside>
    </section>

    <section id="calculator" class="section">
      <div class="section-heading">
        <p class="eyebrow">Exchange Calculator</p>
        <h3>ငွေလဲတွက်စက်</h3>
        <p class="section-subtitle">လဲလိုတဲ့ ပမာဏကို ထည့်ပြီး ရမယ့်ပမာဏကို တွက်ကြည့်ပါ</p>
      </div>
      <div class="calculator-dropdown">
        <div class="calc-row-dropdown">
          <div class="calc-dropdown-group">
            <label for="from-currency">From</label>
            <select id="from-currency" class="currency-dropdown">
              <option value="THB" selected>THB - Thai Baht</option>
              <option value="MMK">MMK - Myanmar Kyat</option>
            </select>
          </div>
          <div class="calc-dropdown-group">
            <label for="to-currency">To</label>
            <select id="to-currency" class="currency-dropdown">
              <option value="THB">THB - Thai Baht</option>
              <option value="MMK" selected>MMK - Myanmar Kyat</option>
            </select>
          </div>
        </div>
        <div class="calc-input-row">
          <div class="calc-input-group">
            <label for="amount-input">Amount</label>
            <input type="number" id="amount-input" placeholder="Enter amount" min="1" step="any" />
          </div>
          <button class="swap-btn-dropdown" id="swap-btn-dropdown">⇄ Swap</button>
        </div>
        <div class="calc-result-dropdown" id="calc-result-dropdown">
          <div class="result-label">Converted Amount</div>
          <div class="result-value-dropdown" id="result-value">0.00</div>
        </div>
        <div class="calc-rate-note-dropdown">
          <p>Rate: <strong>1 THB = ${customerTHBtoMMK} MMK</strong> | <strong>1 MMK = ${(1 / customerMMKtoTHB).toFixed(4)} THB</strong></p>
        </div>
      </div>
    </section>

    <section id="rates" class="section">
      <div class="section-heading">
        <p class="eyebrow">Customer Rates</p>
        <h3>ဝန်ဆောင်မှုနှုန်းထား</h3>
        <p class="section-subtitle">Bot rate မှာ 4% service fee ထည့်ပြီးသား နှုန်းထား</p>
      </div>
      <div class="rate-grid">
        <article class="info-card highlight">
          <p class="mini-label">THB → MMK</p>
          <h4>ဝယ်ဈေး</h4>
          <p class="big-number">${customerTHBtoMMK}</p>
          <p>1 Baht အတွက် မြန်မာကျပ်နှုန်း</p>
          <p class="small-note">Bot rate × 0.96</p>
        </article>
        <article class="info-card highlight alt">
          <p class="mini-label">MMK → THB</p>
          <h4>ရောင်းဈေး</h4>
          <p class="big-number">${customerMMKtoTHB}</p>
          <p>ဝန်ဆောင်မှုရောင်းဈေး နှုန်းထား</p>
          <p class="small-note">Bot rate × 1.04</p>
        </article>
        <article class="info-card">
          <p class="mini-label">Update System</p>
          <h4>Rate Source</h4>
          <p>Original source ကနေ တစ်ရက်တစ်ကြိမ် fetch လုပ်မယ်။</p>
          <p class="small-note">Auto update daily</p>
        </article>
      </div>
    </section>

    <section id="history" class="section">
      <div class="section-heading">
        <p class="eyebrow">Rate History</p>
        <h3>ဈေးနှုန်းမှတ်တမ်း</h3>
        <p class="section-subtitle">ပြီးခဲ့တဲ့ ၇ ရက်အတွင်း ဘတ်ဈေးပြောင်းလဲမှု</p>
      </div>
      <div class="history-container">
        <div class="sparkline-container">
          <div class="sparkline">
            <div class="sparkline-title">ဝယ်ဈေး Trend</div>
            <div class="sparkline-chart">
              ${rateHistory.map((d, i) => `<div class="spark-bar" style="height: ${(d.buy - 127) * 10}px; background: #169b45;" title="${d.date}: ${d.buy}"></div>`).join('')}
            </div>
          </div>
          <div class="sparkline">
            <div class="sparkline-title">ရောင်းဈေး Trend</div>
            <div class="sparkline-chart">
              ${rateHistory.map((d, i) => `<div class="spark-bar" style="height: ${(d.sell - 130) * 10}px; background: #f28c18;" title="${d.date}: ${d.sell}"></div>`).join('')}
            </div>
          </div>
        </div>
        <div class="history-table-container">
          <table class="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>ဝယ်ဈေး</th>
                <th>ရောင်းဈေး</th>
              </tr>
            </thead>
            <tbody>
              ${rateHistory.map(d => `
                <tr>
                  <td>${d.date}</td>
                  <td><strong>${d.buy}</strong></td>
                  <td><strong>${d.sell}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="announcement" class="section">
      <div class="section-heading">
        <p class="eyebrow">Announcement</p>
        <h3>ကြေညာချက်များ</h3>
      </div>
      <div class="announcement-box">
        <p>• Announcement များကို Google Sheet မှ update လုပ်မယ်</p>
        <p>• Payment / transfer delay ရှိရင် ဒီနေရာမှာပြမယ်</p>
        <p>• Service time ပြောင်းလဲမှုရှိရင်လည်း ဒီမှာတင်မယ်</p>
      </div>
    </section>

    <section id="bank-info" class="section">
      <div class="section-heading">
        <p class="eyebrow">Bank Information</p>
        <h3>ငွေလွှဲရန် အကောင့်အချက်အလက်</h3>
        <p class="section-subtitle">Tap Copy button to copy account/number</p>
      </div>
      <div class="bank-grid">
        <article class="info-card">
          <h4>KBZ Pay</h4>
          <p>Name: Khun Myint Aung</p>
          <p>Number: 09778394052</p>
          <button class="copy-btn" data-copy="09778394052">Copy Number</button>
        </article>
        <article class="info-card">
          <h4>KBZ Special Bank</h4>
          <p>Name: Khun Myint Aung</p>
          <p>Account: 34551107002743002</p>
          <button class="copy-btn" data-copy="34551107002743002">Copy Account</button>
        </article>
        <article class="info-card">
          <h4>True Money</h4>
          <p>Name: Khun Myint Aung</p>
          <p>Number: 0944070246</p>
          <button class="copy-btn" data-copy="0944070246">Copy Number</button>
        </article>
        <article class="info-card">
          <h4>Krungthai Bank</h4>
          <p>Name: Khun Myint Aung</p>
          <p>Account: 000-3-35 722-8</p>
          <button class="copy-btn" data-copy="000-3-35 722-8">Copy Account</button>
        </article>
      </div>
    </section>

    <section class="section how-it-works">
      <div class="section-heading">
        <p class="eyebrow">How It Works</p>
        <h3>ငွေလွှဲလုပ်နည်း</h3>
      </div>
      <div class="steps-grid">
        <article class="step-card"><span>01</span><p>ယနေ့ rate ကို စစ်ပါ</p></article>
        <article class="step-card"><span>02</span><p>Admin Telegram ကို ဆက်သွယ်ပါ</p></article>
        <article class="step-card"><span>03</span><p>ငွေလွှဲပြီး screenshot ပို့ပါ</p></article>
        <article class="step-card"><span>04</span><p>အတည်ပြုပြီး transfer ဆောင်ရွက်ပါမယ်</p></article>
      </div>
    </section>

    <section id="contact" class="section contact-section">
      <div>
        <p class="eyebrow">Contact</p>
        <h3>ဆက်သွယ်ရန်</h3>
        <p>Telegram Admin: <a href="https://t.me/Mylifemychoice68" target="_blank" rel="noreferrer">@Mylifemychoice68</a></p>
        <p>Phone: <a href="tel:09778394052">09778394052</a></p>
      </div>
      <a class="btn btn-primary" href="https://t.me/Mylifemychoice68" target="_blank" rel="noreferrer">Telegram မှာ ဆက်သွယ်မယ်</a>
    </section>
  </main>
`

// Update history chart with fetched data
function updateHistoryChart() {
  if (rateHistory.length === 0) return
  
  // Get last 7 days
  const last7Days = rateHistory.slice(0, 7)
  
  // Update history table
  const historyTable = document.querySelector('.history-table tbody')
  if (historyTable) {
    historyTable.innerHTML = ''
    
    last7Days.forEach(day => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>${day.date}</td>
        <td>${day.buy}</td>
        <td>${day.sell}</td>
        <td>${(day.buy * 0.96).toFixed(2)}</td>
        <td>${(day.sell * 1.04).toFixed(2)}</td>
      `
      historyTable.appendChild(row)
    })
  }
  
  // Update sparkline charts (simplified)
  const buyTrendEl = document.querySelector('.sparkline-buy')
  const sellTrendEl = document.querySelector('.sparkline-sell')
  
  if (buyTrendEl) {
    const buyValues = last7Days.map(d => d.buy).reverse()
    buyTrendEl.textContent = `Buy: ${buyValues.join(' → ')}`
  }
  
  if (sellTrendEl) {
    const sellValues = last7Days.map(d => d.sell).reverse()
    sellTrendEl.textContent = `Sell: ${sellValues.join(' → ')}`
  }
}

// Update rate displays in UI
function updateRateDisplays() {
  // Update hero card
  const botBuyEl = document.querySelector('.hero-card .rate-row:nth-child(3) strong')
  const botSellEl = document.querySelector('.hero-card .rate-row:nth-child(4) strong')
  
  if (botBuyEl) botBuyEl.textContent = `${botBuyRate} ကျပ်`
  if (botSellEl) botSellEl.textContent = `${botSellRate} ကျပ်`
  
  // Update customer rates section
  const customerBuyEl = document.querySelector('.info-card.highlight .big-number')
  const customerSellEl = document.querySelector('.info-card.highlight.alt .big-number')
  
  if (customerBuyEl) customerBuyEl.textContent = customerTHBtoMMK
  if (customerSellEl) customerSellEl.textContent = customerMMKtoTHB
  
  // Update calculator rate note
  const rateNoteEl = document.querySelector('.calc-rate-note-dropdown p')
  if (rateNoteEl) {
    rateNoteEl.innerHTML = `Rate: <strong>1 THB = ${customerTHBtoMMK} MMK</strong> | <strong>1 MMK = ${(1 / customerMMKtoTHB).toFixed(4)} THB</strong>`
  }
}

// Fetch rates and history from Google Sheet
async function fetchRatesFromSheet() {
  // Google Sheet CSV URL (fallback to local file for testing)
  const sheetUrl = window.location.hostname === 'localhost' 
    ? '/rates.csv' 
    : 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTagQEQ4BDGhq-Ur1Ypb6BBTbGqcZC1e5Pel5ojBz2EYfseWSiOIfQQNLDSa0sQEs-ilJGAVPy0UziD/pub?output=csv'
  
  try {
    const response = await fetch(sheetUrl)
    const csvText = await response.text()
    
    // Parse CSV
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length < 2) return // No data
    
    // Parse all rows (skip header)
    const history = []
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',')
      if (columns.length >= 3) {
        const date = columns[0].trim()
        const buy = parseFloat(columns[1])
        const sell = parseFloat(columns[2])
        
        if (!isNaN(buy) && !isNaN(sell)) {
          history.push({ date, buy, sell })
        }
      }
    }
    
    // Update history array (latest first)
    rateHistory = history.reverse()
    
    // Get latest rates
    if (rateHistory.length > 0) {
      const latest = rateHistory[0]
      botBuyRate = latest.buy
      botSellRate = latest.sell
      customerTHBtoMMK = (botBuyRate * 0.96).toFixed(2)
      customerMMKtoTHB = (botSellRate * 1.04).toFixed(2)
      
      // Update UI
      updateRateDisplays()
      updateHistoryChart()
      console.log(`Rates updated from sheet: ${botBuyRate}, ${botSellRate} (${rateHistory.length} days)`)
    }
  } catch (error) {
    console.log('Could not fetch rates from sheet, using defaults:', error)
  }
}

// Initialize: fetch rates and update UI
async function initRates() {
  await fetchRatesFromSheet()
  updateRateDisplays()
}

// Initialize rates and UI
initRates()

// Attach event listeners after DOM is rendered
setTimeout(() => {
  // Dropdown calculator
  const fromSelect = document.getElementById('from-currency')
  const toSelect = document.getElementById('to-currency')
  const swapBtn = document.getElementById('swap-btn-dropdown')
  const amountInput = document.getElementById('amount-input')
  const resultValue = document.getElementById('result-value')

  // Update result function
  function updateResult() {
    const amount = parseFloat(amountInput.value)
    const fromCurrency = fromSelect.value
    const toCurrency = toSelect.value

    if (amount && amount > 0) {
      let converted = 0
      if (fromCurrency === 'THB' && toCurrency === 'MMK') {
        converted = calculateTHBtoMMK(amount)
      } else if (fromCurrency === 'MMK' && toCurrency === 'THB') {
        converted = calculateMMKtoTHB(amount)
      } else {
        converted = amount
      }
      resultValue.textContent = converted
    } else {
      resultValue.textContent = '0.00'
    }
  }

  // Swap button
  swapBtn.addEventListener('click', () => {
    const temp = fromSelect.value
    fromSelect.value = toSelect.value
    toSelect.value = temp
    updateResult()
  })

  // Auto calculate on changes
  fromSelect.addEventListener('change', updateResult)
  toSelect.addEventListener('change', updateResult)
  amountInput.addEventListener('input', updateResult)

  // Initial calculation
  updateResult()

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      copyToClipboard(btn.dataset.copy, btn)
    })
  })
}, 100)
