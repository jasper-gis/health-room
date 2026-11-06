'use strict';

const SYSTEMS = [
  { id: 'cardiovascular', title: '心血管', short: '心血管', icon: 'heart', x: 180, y: 190, side: 'right' },
  { id: 'kidney', title: '肾脏与排尿', short: '肾脏', icon: 'kidney', x: 183, y: 282, side: 'right' },
  { id: 'hepatobiliary', title: '肝胆与代谢', short: '肝胆', icon: 'liver', x: 132, y: 242, side: 'left' },
  { id: 'lung', title: '肺部', short: '肺部', icon: 'lung', x: 130, y: 174, side: 'left' },
  { id: 'thyroid', title: '甲状腺', short: '甲状腺', icon: 'thyroid', x: 160, y: 114, side: 'right' },
  { id: 'oncology-markers', title: '肿瘤相关指标', short: '肿瘤相关', icon: 'scan', x: 165, y: 335, side: 'left' },
  { id: 'general', title: '一般检查与影像', short: '一般检查', icon: 'body', x: 160, y: 455, side: 'right' }
];
const DISCLAIMER = '仅供个人资料整理与学习，不构成诊疗建议';
const state = { tab: 'body', system: 'cardiovascular', year: '2026', data: null };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const icon = (name, extraClass = '') => `<svg class="icon ${extraClass}" aria-hidden="true"><use href="assets/icons/sprite.svg#${name}"></use></svg>`;
const pending = '待美年报告填入';
const hasValue = (value) => value !== null && value !== undefined && value !== '';

function pageHeading(symbol, title, detail, counter = '') {
  return `<header class="page-heading"><div class="page-icon">${icon(symbol)}</div><div><h2>${escapeHTML(title)}</h2><p>${escapeHTML(detail)}</p></div>${counter ? `<span class="page-counter">${escapeHTML(counter)}</span>` : ''}</header>`;
}

function emptyState(symbol, title, detail, action = '') {
  return `<div class="empty-state"><div class="empty-icon">${icon(symbol)}</div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(detail)}</p>${action}</div>`;
}

function flagBadge(flag) {
  const flags = { normal: '正常', watch: '关注', abnormal: '异常', pending: '待填入' };
  const knownFlag = Object.hasOwn(flags, flag) ? flag : 'pending';
  return `<span class="badge ${knownFlag}">${flags[knownFlag]}</span>`;
}

function renderProfile() {
  const profile = state.data.profile;
  $('#profile-name').textContent = profile.display_name || '蒋元甲';
  $('#profile-relation').textContent = '本人';
  $('#profile-age').innerHTML = hasValue(profile.age) ? `${escapeHTML(profile.age)}<small>岁</small>` : '—';
  $('#profile-height').innerHTML = hasValue(profile.height_cm) ? `${escapeHTML(profile.height_cm)}<small>cm</small>` : '—';
  $('#profile-weight').innerHTML = hasValue(profile.weight_kg) ? `${escapeHTML(profile.weight_kg)}<small>kg</small>` : '—';
  $('#profile-location').textContent = profile.location || '地点待填入';
  $('#profile-birthday').textContent = profile.birth_date || '生日待填入';
  $('#profile-status').textContent = profile.status === 'pending_report' ? pending : '资料已载入 · 以原始报告为准';
  const lifestyle = profile.lifestyle || {};
  $('#lifestyle-list').innerHTML = [['工作', lifestyle.work], ['吸烟', lifestyle.smoking], ['睡眠', lifestyle.sleep], ['过敏', lifestyle.allergies]]
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHTML(value || '待填入')}</dd></div>`).join('');
  const previewIds = Array.isArray(profile.key_labs_preview) ? profile.key_labs_preview.map((item) => typeof item === 'string' ? item : item.id) : [];
  const preferred = state.data.labs.items.filter((lab) => previewIds.includes(lab.id));
  const labs = (preferred.length ? preferred : state.data.labs.items).slice(0, 2);
  $('#key-labs').innerHTML = labs.length ? labs.map((lab) => `<div class="key-lab"><div class="key-lab-name"><button class="term-button" type="button" data-term="${escapeHTML(lab.id)}" aria-label="解释 ${escapeHTML(lab.name)}">${escapeHTML(lab.name)}</button><span>${escapeHTML(lab.name_zh)}</span></div><div class="key-lab-value"><strong>${hasValue(lab.value) ? escapeHTML(lab.value) : '—'}</strong><span>${escapeHTML(lab.unit)}</span><small>${hasValue(lab.value) ? escapeHTML(lab.date || '日期待填入') : '待报告'}</small></div></div>`).join('') : `<p class="muted key-lab">${pending}</p>`;
}

function summaryText(entries) {
  if (!Array.isArray(entries) || !entries.length) return '<span>—</span><span class="pending-line">待美年报告填入</span>';
  const latest = entries[entries.length - 1];
  if (typeof latest === 'string') return escapeHTML(latest);
  return `${escapeHTML(latest.date || '')}<br>${escapeHTML(latest.text || latest.summary || latest.note || latest.title || pending)}`;
}

function renderSystems() {
  $('#body-hotspots').innerHTML = SYSTEMS.map((system) => `<button class="hotspot label-${system.side}" type="button" data-system="${system.id}" style="left:${system.x / 3.2}%;top:${system.y / 6}%" aria-label="查看${system.title}" aria-pressed="false">${icon(system.icon)}<span class="hotspot-name">${system.short}</span></button>`).join('');
  $('#system-shortcuts').innerHTML = SYSTEMS.slice(0, 4).map((system) => `<button class="shortcut" type="button" data-system="${system.id}" aria-pressed="false">${icon(system.icon)}${system.short}${icon('arrow', 'arrow')}</button>`).join('');
  $('#system-cards').innerHTML = SYSTEMS.map((system) => {
    const data = state.data.systems.find((item) => item.id === system.id);
    return `<article class="system-row"><button class="system-card" type="button" data-system="${system.id}" aria-pressed="false" aria-label="选择${escapeHTML(data.title)}系统">${icon(system.icon)}<h3>${escapeHTML(data.title)}</h3><p>${escapeHTML(data.priority_note || pending)}</p><span class="system-card-foot"><span>查看资料</span>${icon('arrow')}</span></button><dl class="system-summary"><div><dt>重要经过</dt><dd>${summaryText(data.history)}</dd></div><div><dt>最近已知</dt><dd>${summaryText(data.latest_known)}</dd></div></dl></article>`;
  }).join('');
  selectSystem(state.system, false);
}

function renderSources() {
  const sources = [...new Set(state.data.labs.items.map((lab) => lab.source).filter(Boolean))];
  const profile = state.data.profile;
  $('#sources-panel').innerHTML = pageHeading('file', '资料依据', '每一条资料，都能回到原始报告。', `${sources.length} 份已解析来源`) +
    (sources.length ? `<div class="content-card"><h3>已解析来源</h3>${sources.map((source) => `<div class="source-row">${icon('file')}<div><strong>${escapeHTML(source)}</strong><p>原始报告目录：raw/ · 指标来源引用</p></div><span class="badge">已引用</span></div>`).join('')}</div>` : emptyState('folder', '待放入美年报告', '将 PDF 或截图放入 raw/ 文件夹，完成导入后，这里会显示报告来源与已解析资料。', `<button class="primary-button" type="button" data-info="import">查看导入说明${icon('arrow')}</button>`)) +
    `<div class="content-card"><h3>本次体检档案</h3><div class="source-row">${icon('calendar')}<div><strong>${escapeHTML(profile.checkup_org || '体检机构待填入')} · ${escapeHTML(profile.checkup_package || '套餐待填入')}</strong><p>${escapeHTML(profile.checkup_date || '日期待填入')} · ${pending}</p></div><span class="badge">待报告</span></div></div><p class="page-note">${icon('info')}<span>页面展示已导入的来源引用，不会自动扫描 raw/ 文件夹。</span></p>`;
}

function renderLabs() {
  const labs = state.data.labs.items;
  $('#labs-panel').innerHTML = pageHeading('flask', '检查与指标', '按报告原文整理，保留单位、参考范围与来源。', `${labs.length} 项指标`) +
    `<div class="content-card"><div class="table-wrap"><table class="labs-table"><thead><tr><th scope="col">名称</th><th scope="col">值</th><th scope="col">单位</th><th scope="col">参考范围</th><th scope="col">日期</th><th scope="col">状态</th></tr></thead><tbody>${labs.map((lab) => `<tr><td><button class="term-button" type="button" data-term="${escapeHTML(lab.id)}">${escapeHTML(lab.name)}</button><small>${escapeHTML(lab.name_zh)}</small></td><td class="lab-number">${hasValue(lab.value) ? escapeHTML(lab.value) : '—'}</td><td>${escapeHTML(lab.unit || '—')}</td><td>${escapeHTML(lab.ref_range || '待填入')}</td><td>${escapeHTML(lab.date || '待填入')}</td><td>${flagBadge(lab.flag)}</td></tr>`).join('')}</tbody></table></div><div class="table-footer">${pending} · ${escapeHTML(state.data.labs.updated_at ? `资料更新于 ${state.data.labs.updated_at}` : '暂无更新日期')}</div></div><p class="page-note">${icon('info')}<span>点击指标缩写可查看术语。空值表示未录入，不能据此判断健康状态。</span></p>`;
}

function renderMeds() {
  const meds = state.data.meds.items;
  $('#meds-panel').innerHTML = pageHeading('pill', '用药', '整理已有用药记录与对应来源。', `${meds.length} 条记录`) +
    (meds.length ? `<div class="content-card">${meds.map((med) => `<div class="source-row">${icon('pill')}<div><strong>${escapeHTML(med.name || '用药记录')}</strong><p>${escapeHTML(med.note || med.detail || '详情待填入')}</p></div><span class="badge">${escapeHTML(med.status || '已记录')}</span></div>`).join('')}</div>` : emptyState('pill', '暂无用药记录', '待美年报告填入。未录入记录，不代表没有用药。')) +
    `<div class="content-card"><h3>资料记录范围</h3><p class="muted">仅整理已有处方或本人提供的用药资料；用药调整请以医生意见为准。</p></div>`;
}

function renderPlan() {
  const plans = state.data.plan;
  $('#plan-panel').innerHTML = pageHeading('calendar', '随访与安排', '把资料整理与后续安排，放在同一处。', `${plans.length} 项安排`) +
    '<p class="plan-intro">以下为资料整理示例，尚未安排。查看按钮仅跳转对应页面，不会保存安排。</p>' +
    `<div class="plan-list">${plans.map((plan, index) => `<article class="plan-card"><div class="plan-top"><h3>${escapeHTML(plan.title)}</h3><span class="badge">${escapeHTML(plan.status)}</span></div><p>${escapeHTML(plan.detail)}</p><div class="plan-actions">${plan.actions.map((action, actionIndex) => `<button class="${index === 0 && actionIndex === 0 ? 'primary' : 'secondary'}-button" type="button" data-plan="${escapeHTML(plan.id)}" data-plan-action="${actionIndex}">${escapeHTML(action)}${icon('arrow')}</button>`).join('')}</div></article>`).join('')}</div>`;
}

// Only this small Markdown subset is supported. Raw HTML, images, and links stay inert text.
function renderMarkdown(markdown) {
  function inline(text) {
    return escapeHTML(text).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }
  let listOpen = false;
  const html = [];
  for (const line of markdown.split(/\r?\n/)) {
    const bullet = line.match(/^\s*[-*] (.+)$/);
    if (bullet) {
      if (!listOpen) html.push('<ul>');
      listOpen = true;
      html.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }
    if (listOpen) { html.push('</ul>'); listOpen = false; }
    if (!line.trim()) continue;
    const heading = line.match(/^(#{1,4}) (.+)$/);
    html.push(heading ? `<h${heading[1].length === 1 ? '2' : '3'}>${inline(heading[2])}</h${heading[1].length === 1 ? '2' : '3'}>` : `<p>${inline(line)}</p>`);
  }
  if (listOpen) html.push('</ul>');
  return html.join('');
}

function renderAI() {
  $('#ai-panel').innerHTML = pageHeading('sparkles', 'AI 分析', '基于已整理资料的阅读笔记。', '待报告') + `<article class="content-card ai-copy">${renderMarkdown(state.data.notes)}</article><footer class="ai-disclaimer">${icon('info')}${DISCLAIMER}</footer>`;
}

function selectTab(tabId, focusTab = false) {
  if (!$(`#tab-${tabId}`)) return;
  state.tab = tabId;
  $$('.tab').forEach((button) => {
    const active = button.dataset.tab === tabId;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && focusTab) button.focus();
  });
  $$('[role="tabpanel"]').forEach((panel) => { panel.hidden = panel.id !== `${tabId}-panel`; });
  $('#systems-panel').hidden = tabId !== 'body';
  $('#workspace').classList.toggle('is-overview', tabId === 'body');
  $('#connector').toggleAttribute('hidden', tabId !== 'body');
  requestAnimationFrame(drawConnector);
}

function selectSystem(id, scrollCard = true) {
  if (!SYSTEMS.some((system) => system.id === id)) return;
  state.system = id;
  $$('[data-system]').forEach((button) => {
    const active = button.dataset.system === id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (scrollCard) {
    const card = $(`.system-card[data-system="${id}"]`);
    const stack = $('#system-cards');
    if (card && stack.scrollHeight > stack.clientHeight) {
      const cardRect = card.getBoundingClientRect();
      const stackRect = stack.getBoundingClientRect();
      if (cardRect.top < stackRect.top || cardRect.bottom > stackRect.bottom) stack.scrollTop += cardRect.top - stackRect.top - 8;
    }
    $('#live-status').textContent = `已选择${SYSTEMS.find((system) => system.id === id).title}，${pending}`;
  }
  requestAnimationFrame(drawConnector);
}

function drawConnector() {
  if (state.tab !== 'body') return;
  const hot = $(`.hotspot[data-system="${state.system}"]`);
  const card = $(`.system-card[data-system="${state.system}"]`);
  if (!hot || !card) return;
  const box = $('#workspace').getBoundingClientRect();
  const from = hot.getBoundingClientRect();
  const to = card.getBoundingClientRect();
  const stack = $('#system-cards').getBoundingClientRect();
  const endY = to.top + to.height / 2;
  const visible = endY >= stack.top && endY <= stack.bottom;
  $('#connector').style.visibility = visible ? 'visible' : 'hidden';
  if (!visible) return;
  const x1 = from.right - box.left + 4;
  const y1 = from.top + from.height / 2 - box.top;
  const x2 = to.left - box.left;
  const y2 = endY - box.top;
  const bend = (x1 + x2) / 2;
  $('#connector-path').setAttribute('d', `M${x1},${y1} C${bend},${y1} ${bend - 30},${y2} ${x2},${y2}`);
  $('#connector-dot').setAttribute('cx', String(x1));
  $('#connector-dot').setAttribute('cy', String(y1));
}

function showDialog(title, body, eyebrow = '资料说明') {
  $('#dialog-content').innerHTML = `<div class="dialog-eyebrow">${escapeHTML(eyebrow)}</div><h2 id="dialog-title">${escapeHTML(title)}</h2>${body}`;
  $('#info-dialog').showModal();
}

function showInfo(kind) {
  const infos = {
    import: ['放入你的体检报告', '<p>将美年 PDF 或截图保存到项目的 <code>raw/</code> 文件夹。然后在仓库中告诉 Codex：</p><div class="dialog-divider"></div><p>「按 AGENTS.md 导入最新美年报告」</p><div class="dialog-divider"></div><p>导入并更新本地资料后，刷新此页面。当前页面只读，不会上传报告。</p>'],
    notifications: ['暂无通知', '<p>当前为静态空壳，尚未启用通知与提醒。近期事项可在「近期安排」中查看。</p>'],
    settings: ['本地个人资料', '<p>资料来自项目的 data/ 文件夹，原始报告保存在 raw/。当前页面只读；资料更新后刷新即可。</p><div class="dialog-divider"></div><p>无账号、无云端同步。所有界面资源均来自本地。</p>']
  };
  if (infos[kind]) showDialog(...infos[kind]);
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.tab) selectTab(button.dataset.tab);
  if (button.dataset.openTab) selectTab(button.dataset.openTab, true);
  if (button.dataset.system) selectSystem(button.dataset.system);
  if (button.dataset.info) showInfo(button.dataset.info);
  if (button.dataset.year) {
    state.year = button.dataset.year;
    $$('[data-year]').forEach((year) => {
      const active = year.dataset.year === state.year;
      year.classList.toggle('is-active', active);
      year.setAttribute('aria-pressed', String(active));
    });
    $('#timeline-hint').textContent = `${state.year} · 占位，暂不筛选`;
    $('#live-status').textContent = `已选择 ${state.year} 年。空壳时间轴，暂不筛选资料。`;
  }
  if (button.dataset.term && state.data) {
    const lab = state.data.labs.items.find((item) => item.id === button.dataset.term);
    if (lab) {
      const descriptions = { 'LDL-C': '低密度脂蛋白胆固醇', UACR: '尿白蛋白与肌酐比值' };
      showDialog(lab.name, `<p>${escapeHTML(lab.name_zh || descriptions[lab.name] || '术语解释待补充')}</p><div class="dialog-divider"></div><p>${hasValue(lab.value) ? `来源：${escapeHTML(lab.source || '来源待填入')}` : pending}。具体含义与结果请结合原始报告及医生意见。</p>`, '指标术语');
    }
  }
  if (button.dataset.plan && state.data) {
    const plan = state.data.plan.find((item) => item.id === button.dataset.plan);
    const action = plan?.actions[Number(button.dataset.planAction)];
    if (action === '查看资料依据') selectTab('sources', true);
    else if (action === '查看检查与指标') selectTab('labs', true);
    else if (plan && action) showDialog(action, `<p>${escapeHTML(plan.detail)}</p><div class="dialog-divider"></div><p>这是空壳中的示例操作，尚未记录或提交安排。资料准备完成后，可由 Codex 更新本地安排文件。</p>`, '示例安排');
  }
  if (button.classList.contains('dialog-close')) $('#info-dialog').close();
});

$('.tabs').addEventListener('keydown', (event) => {
  const tabs = $$('.tab');
  const current = tabs.indexOf(document.activeElement);
  if (current < 0) return;
  let next = current;
  if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') next = (current + tabs.length - 1) % tabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  else return;
  event.preventDefault();
  selectTab(tabs[next].dataset.tab, true);
});

$('#info-dialog').addEventListener('click', (event) => {
  if (event.target !== $('#info-dialog')) return;
  const rect = $('#info-dialog').getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('#info-dialog').close();
});
$('#system-cards').addEventListener('scroll', drawConnector, { passive: true });
window.addEventListener('resize', drawConnector);
$('#body-figure img').addEventListener('load', drawConnector);
if ('ResizeObserver' in window) new ResizeObserver(drawConnector).observe($('#workspace'));

async function loadData() {
  selectTab('body');
  if (location.protocol === 'file:') {
    showLoadError('直接打开文件时，浏览器可能阻止读取 JSON。请从仓库根目录启动静态服务器。');
    return;
  }
  try {
    const paths = ['profile.json', 'labs.json', 'meds.json', 'plan.json', 'ai-notes.md', ...SYSTEMS.map((system) => `systems/${system.id}.json`)];
    const values = await Promise.all(paths.map(async (path) => {
      const response = await fetch(`../data/${path}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`无法读取 data/${path}（${response.status}）`);
      return path.endsWith('.md') ? response.text() : response.json();
    }));
    const [profile, labs, meds, plan, notes, ...systems] = values;
    if (!profile || !Array.isArray(labs?.items) || !Array.isArray(meds?.items) || !Array.isArray(plan) || !plan.every((item) => Array.isArray(item.actions)) || !systems.every((system, index) => system?.id === SYSTEMS[index].id)) throw new Error('本地数据结构不完整，请检查 data/ 文件。');
    state.data = { profile, labs, meds, plan, notes, systems };
    renderProfile();
    renderSystems();
    renderSources();
    renderLabs();
    renderMeds();
    renderPlan();
    renderAI();
    $('#load-notice').hidden = true;
  } catch (error) {
    showLoadError(`本地资料尚未加载成功。${error.message}`);
  }
}

function showLoadError(message) {
  $('#load-notice').classList.add('is-error');
  $('#load-notice').innerHTML = `<strong>本地资料未加载</strong><br>${escapeHTML(message)}<br>Windows：在仓库根目录运行 <code>py -3.11 -m http.server 8000 --bind 127.0.0.1</code><br>Mac / Linux：<code>python3 -m http.server 8000 --bind 127.0.0.1</code><br>打开 <a href="http://127.0.0.1:8000/web/index.html">http://127.0.0.1:8000/web/index.html</a>。若服务已启动，请检查上面的文件错误后刷新。`;
  $('#profile-status').textContent = '本地资料未加载';
  $('#key-labs').innerHTML = '<p class="muted key-lab">本地资料未加载</p>';
  $('#system-cards').innerHTML = '<div class="glass-card loading-card">本地资料未加载<br>请按上方说明打开页面。</div>';
  $$('.detail-page').forEach((panel) => { panel.innerHTML = emptyState('folder', '本地资料未加载', '请按页面上方的说明，通过本地静态服务器重新打开。'); });
}

loadData();
