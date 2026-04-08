(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`/assets/logo-D_wpgmOE.jpg`,t=129.87,n=133.33,r=4,i=[],a=(t*.96).toFixed(2),o=(n*1.04).toFixed(2),s=[{min:1,max:1e3,fee:.04},{min:1001,max:1e4,fee:.03},{min:10001,max:999999,fee:.02}];function c(e){for(let t of s)if(e>=t.min&&e<=t.max)return t.fee;return .04}function l(e){let n=c(e);return(e*(t*(1-n))).toFixed(2)}function u(e){let t=c(e);return(e/(n*(1+t))).toFixed(2)}function d(e,t){navigator.clipboard.writeText(e).then(()=>{let e=t.textContent;t.textContent=`Copied!`,t.style.background=`#169b45`,setTimeout(()=>{t.textContent=e,t.style.background=``},1500)})}document.querySelector(`#app`).innerHTML=`
  <header class="site-header">
    <div class="brand">
      <img src="${e}" alt="Mahar Shwe Exchange Logo" class="brand-logo" />
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
          <strong>${t} ကျပ်</strong>
        </div>
        <div class="rate-row">
          <span>ရောင်းဈေး (Bot)</span>
          <strong>${n} ကျပ်</strong>
        </div>
        <div class="rate-row highlight">
          <span>Service Fee</span>
          <strong>${r}%</strong>
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
          <p>Rate: <strong>1 THB = ${a} MMK</strong> | <strong>1 MMK = ${(1/o).toFixed(4)} THB</strong></p>
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
          <p class="big-number">${a}</p>
          <p>1 Baht အတွက် မြန်မာကျပ်နှုန်း</p>
          <p class="small-note">Bot rate × 0.96</p>
        </article>
        <article class="info-card highlight alt">
          <p class="mini-label">MMK → THB</p>
          <h4>ရောင်းဈေး</h4>
          <p class="big-number">${o}</p>
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
              ${i.map((e,t)=>`<div class="spark-bar" style="height: ${(e.buy-127)*10}px; background: #169b45;" title="${e.date}: ${e.buy}"></div>`).join(``)}
            </div>
          </div>
          <div class="sparkline">
            <div class="sparkline-title">ရောင်းဈေး Trend</div>
            <div class="sparkline-chart">
              ${i.map((e,t)=>`<div class="spark-bar" style="height: ${(e.sell-130)*10}px; background: #f28c18;" title="${e.date}: ${e.sell}"></div>`).join(``)}
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
              ${i.map(e=>`
                <tr>
                  <td>${e.date}</td>
                  <td><strong>${e.buy}</strong></td>
                  <td><strong>${e.sell}</strong></td>
                </tr>
              `).join(``)}
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
`;function f(){if(i.length===0)return;let e=i.slice(0,7),t=document.querySelector(`.history-table tbody`);t&&(t.innerHTML=``,e.forEach(e=>{let n=document.createElement(`tr`);n.innerHTML=`
        <td>${e.date}</td>
        <td>${e.buy}</td>
        <td>${e.sell}</td>
        <td>${(e.buy*.96).toFixed(2)}</td>
        <td>${(e.sell*1.04).toFixed(2)}</td>
      `,t.appendChild(n)}));let n=document.querySelector(`.sparkline-buy`),r=document.querySelector(`.sparkline-sell`);n&&(n.textContent=`Buy: ${e.map(e=>e.buy).reverse().join(` → `)}`),r&&(r.textContent=`Sell: ${e.map(e=>e.sell).reverse().join(` → `)}`)}function p(){let e=document.querySelector(`.hero-card .rate-row:nth-child(3) strong`),r=document.querySelector(`.hero-card .rate-row:nth-child(4) strong`);e&&(e.textContent=`${t} ကျပ်`),r&&(r.textContent=`${n} ကျပ်`);let i=document.querySelector(`.info-card.highlight .big-number`),s=document.querySelector(`.info-card.highlight.alt .big-number`);i&&(i.textContent=a),s&&(s.textContent=o);let c=document.querySelector(`.calc-rate-note-dropdown p`);c&&(c.innerHTML=`Rate: <strong>1 THB = ${a} MMK</strong> | <strong>1 MMK = ${(1/o).toFixed(4)} THB</strong>`)}async function m(){let e=window.location.hostname===`localhost`?`/rates.csv`:`https://docs.google.com/spreadsheets/d/e/2PACX-1vTagQEQ4BDGhq-Ur1Ypb6BBTbGqcZC1e5Pel5ojBz2EYfseWSiOIfQQNLDSa0sQEs-ilJGAVPy0UziD/pub?output=csv`;try{let r=(await(await fetch(e)).text()).split(`
`).filter(e=>e.trim());if(r.length<2)return;let s=[];for(let e=1;e<r.length;e++){let t=r[e].split(`,`);if(t.length>=3){let e=t[0].trim(),n=parseFloat(t[1]),r=parseFloat(t[2]);!isNaN(n)&&!isNaN(r)&&s.push({date:e,buy:n,sell:r})}}if(i=s.reverse(),i.length>0){let e=i[0];t=e.buy,n=e.sell,a=(t*.96).toFixed(2),o=(n*1.04).toFixed(2),p(),f(),console.log(`Rates updated from sheet: ${t}, ${n} (${i.length} days)`)}}catch(e){console.log(`Could not fetch rates from sheet, using defaults:`,e)}}async function h(){await m(),p()}h(),setTimeout(()=>{let e=document.getElementById(`from-currency`),t=document.getElementById(`to-currency`),n=document.getElementById(`swap-btn-dropdown`),r=document.getElementById(`amount-input`),i=document.getElementById(`result-value`);function a(){let n=parseFloat(r.value),a=e.value,o=t.value;if(n&&n>0){let e=0;e=a===`THB`&&o===`MMK`?l(n):a===`MMK`&&o===`THB`?u(n):n,i.textContent=e}else i.textContent=`0.00`}n.addEventListener(`click`,()=>{let n=e.value;e.value=t.value,t.value=n,a()}),e.addEventListener(`change`,a),t.addEventListener(`change`,a),r.addEventListener(`input`,a),a(),document.querySelectorAll(`.copy-btn`).forEach(e=>{e.addEventListener(`click`,()=>{d(e.dataset.copy,e)})})},100);