// The yaft.cc home page. `{{APP_SLUG}}` is replaced with the GitHub App's slug when served.
export const LANDING_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>YAFT · Yet another financial tracker</title>
<meta name="description" content="A native iPhone expense tracker that keeps every transaction as a file in a private GitHub repository you own.">
<meta name="theme-color" content="#EEF2F7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='18' fill='%232F6FED'/%3E%3Ctext x='32' y='45' font-family='system-ui' font-weight='800' font-size='36' fill='white' text-anchor='middle'%3E%C2%A5%3C/text%3E%3C/svg%3E">
<style>
:root{--bg:#EEF2F7;--card:#fff;--text:#0B1220;--muted:#6B7280;--line:rgba(60,60,67,.14);--tint:#2F6FED;--red:#E5484D;--green:#2BA160;color-scheme:light dark}
@media (prefers-color-scheme:dark){:root{--bg:#000;--card:#1C1C1E;--text:#F5F5F7;--muted:#8E8E93;--line:rgba(84,84,88,.6);--tint:#5B8DEF;--red:#FF6369;--green:#3DD68C}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:17px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
h1,h2,h3,.logo,.amt{font-family:ui-rounded,"SF Pro Rounded",-apple-system,system-ui,sans-serif}
a{color:var(--tint)}
.wrap{max-width:1040px;margin:0 auto;padding:0 24px}
nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px;text-decoration:none;color:var(--text)}
.mark{width:36px;height:36px;border-radius:11px;background:var(--tint);color:#fff;display:grid;place-items:center;font-size:21px}
nav .links a{color:var(--muted);text-decoration:none;font-weight:600;margin-left:22px}
.hero{display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:center;padding:56px 0 72px}
h1{font-size:clamp(40px,6vw,64px);line-height:1.04;margin:0 0 20px;letter-spacing:-.02em}
.lead{font-size:20px;color:var(--muted);margin:0 0 32px;max-width:34em}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;height:52px;padding:0 24px;border-radius:26px;font-weight:700;text-decoration:none}
.btn.primary{background:var(--text);color:var(--bg)}
.btn.ghost{background:var(--card);color:var(--text)}
.phone{background:var(--card);border-radius:36px;padding:22px;box-shadow:0 30px 60px -30px rgba(15,30,60,.35)}
.phone .day{display:flex;justify-content:space-between;font-weight:700;font-size:15px;margin:4px 4px 12px}
.row{display:flex;align-items:center;gap:12px;padding:11px 4px;border-top:1px solid var(--line)}
.row:first-of-type{border-top:0}
.ico{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:20px}
.row b{display:block;font-size:16px}.row small{color:var(--muted);font-size:13px}
.row .amt{margin-left:auto;font-weight:800;font-variant-numeric:tabular-nums}
.neg{color:var(--red)}.pos{color:var(--green)}
.budget{margin-top:18px;padding:16px;border-radius:20px;background:var(--bg)}
.bar{height:10px;border-radius:5px;background:var(--line);overflow:hidden;margin-top:10px}.bar i{display:block;height:100%;width:62%;background:var(--tint);border-radius:5px}
section{padding:56px 0}
h2{font-size:34px;margin:0 0 28px;letter-spacing:-.01em}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{background:var(--card);border-radius:24px;padding:24px}
.card h3{margin:10px 0 6px;font-size:19px}.card p{margin:0;color:var(--muted)}
.emoji{font-size:30px}
ol.steps{counter-reset:s;list-style:none;padding:0;margin:0;display:grid;gap:14px}
ol.steps li{counter-increment:s;background:var(--card);border-radius:20px;padding:18px 20px 18px 68px;position:relative}
ol.steps li::before{content:counter(s);position:absolute;left:20px;top:18px;width:32px;height:32px;border-radius:50%;background:var(--tint);color:#fff;display:grid;place-items:center;font-weight:800}
pre{background:var(--card);border-radius:20px;padding:20px;overflow:auto;font:14px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;margin:0}
.two{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}
ul.plain{padding-left:20px;margin:0}ul.plain li{margin:6px 0}
footer{padding:40px 0 56px;color:var(--muted);font-size:15px;border-top:1px solid var(--line)}
@media (max-width:820px){.hero,.two{grid-template-columns:1fr}.grid{grid-template-columns:1fr}.hero{padding-top:24px}nav .links{display:none}}
</style>
</head>
<body>
<div class="wrap">
<nav><a class="logo" href="/"><span class="mark">¥</span>YAFT</a><span class="links"><a href="#how">How it works</a><a href="#privacy">Privacy</a></span></nav>

<header class="hero">
<div>
<h1>Your money,<br>in your own repo.</h1>
<p class="lead">YAFT is a fast, native iPhone expense tracker. Every account, budget and transaction is a small JSON file in a private GitHub repository that you own. No YAFT account, and no server keeps your data.</p>
<div class="btns">
<a class="btn primary" href="https://github.com/apps/{{APP_SLUG}}/installations/new">Install the GitHub App</a>
<a class="btn ghost" href="#how">How it works</a>
</div>
</div>
<div class="phone" aria-hidden="true">
<div class="day"><span>Today</span><span class="neg amt">-Rp299,500</span></div>
<div class="row"><span class="ico" style="background:#FF9F4333">🍽️</span><span><b>Nasi padang</b><small>Dining · Cash</small></span><span class="amt neg">-Rp45,000</span></div>
<div class="row"><span class="ico" style="background:#FECA5733">🚌</span><span><b>Gojek</b><small>Transit · Cash</small></span><span class="amt neg">-Rp18,000</span></div>
<div class="row"><span class="ico" style="background:#1DD1A133">💰</span><span><b>Salary</b><small>Salary · BCA</small></span><span class="amt pos">+Rp15,000,000</span></div>
<div class="budget"><b>Monthly spending</b><br><small style="color:var(--muted)">Rp2,280,000 left of Rp6,000,000</small><div class="bar"><i></i></div></div>
</div>
</header>

<section>
<h2>Built like an iPhone app should be</h2>
<div class="grid">
<div class="card"><div class="emoji">✨</div><h3>Native and quick</h3><p>System tab bar, sheets, menus and pickers. A calculator keypad so 45000+12500 goes straight in.</p></div>
<div class="card"><div class="emoji">✈️</div><h3>Works offline</h3><p>Everything is saved on the phone first and synced a moment later as a single commit.</p></div>
<div class="card"><div class="emoji">🔑</div><h3>Yours for good</h3><p>Plain JSON with full git history. Clone the repository and your data comes with you.</p></div>
</div>
</section>

<section id="how">
<h2>How it works</h2>
<div class="two">
<ol class="steps">
<li><b>Sign in with GitHub.</b> Your phone gets a token that is stored in the iOS Keychain.</li>
<li><b>Install YAFT on one private repository.</b> Pick only that repository; the app cannot see any other.</li>
<li><b>Track as usual.</b> Each change becomes a file. The app pulls only the files that changed and pushes yours as one commit, so several devices stay in step.</li>
</ol>
<pre>yaft.json
accounts/bca.json
categories/dining.json
budgets/monthly.json
tx/2026/11/01JD3K8Q7Y….json
tx/2026/11/01JD3KB2RM….json</pre>
</div>
</section>

<section id="privacy">
<h2>Permissions and privacy</h2>
<div class="two">
<div class="card"><h3>What YAFT can access</h3><ul class="plain">
<li><b>Contents: read and write</b>, on the repositories you choose when installing</li>
<li><b>Metadata: read</b>, which GitHub requires for every app</li>
<li>Nothing else: no other repositories, no email, no organizations</li>
</ul></div>
<div class="card"><h3>What yaft.cc does</h3><p>This site only exchanges the one-time sign-in code for a token, because that step needs the app's client secret, and hands the token straight back to your phone. It never stores tokens and never reads your repository. Your financial data goes directly between your phone and GitHub. You can revoke access at any time in <a href="https://github.com/settings/installations">GitHub settings</a>.</p></div>
</div>
</section>

<footer>© 2026 YAFT · Yet another financial tracker</footer>
</div>
</body>
</html>
`;
