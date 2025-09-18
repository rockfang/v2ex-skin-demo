(function(){
  const presetSel = document.getElementById('preset');
  const hue = document.getElementById('hue');
  const sat = document.getElementById('sat');
  const lit = document.getElementById('lit');
  const huev = document.getElementById('huev');
  const satv = document.getElementById('satv');
  const litv = document.getElementById('litv');
  const night = document.getElementById('night');
  const wrap = document.getElementById('Wrapper');
  const snippet = document.getElementById('snippet');
  const titleCN = document.getElementById('titleCN');
  const btnSave = document.getElementById('saveTheme');
  function updateSaveBtn(){
    if(!btnSave) return;
    const h = +hue.value, s = +sat.value, l = +lit.value;
    // 命中用户主题？
    const list = loadSavedThemes();
    const hitUser = Array.isArray(list) && list.find(x=>+x.h===h && +x.s===s && +x.l===l);
    // 命中预设？
    let hitPreset = null;
    for(const [k,v] of Object.entries(PRESETS)){ if(v[0]===h && v[1]===s && v[2]===l){ hitPreset = k; break; } }
    btnSave.style.display = (!hitUser && !hitPreset) ? '' : 'none';
  }

  const PRESETS = {
    denim:[210,65,52,'深牛仔蓝'],
    pine:[150,42,44,'松针绿'],
    amber:[38,85,52,'琥珀金'],
    rust:[18,66,50,'铁锈橙红'],
    slate:[220,32,52,'石板蓝灰'],
    seafoam:[170,48,48,'海沫青绿'],
  };

  function equalTrip(a,b){return a[0]==b[0] && a[1]==b[1] && a[2]==b[2];}

  // 压缩导出：去注释/多余空白，合成一行
  function compressCss(css){
    return css
      .replace(/\/\*[\s\S]*?\*\//g,"")
      .replace(/\s+/g," ")
      .replace(/\s*([:;{},])\s*/g,"$1")
      .trim();
  }

  // 读取导出底稿 + 变量片段，写入 textarea
  function updateSnippet(){
    const h = hue.value, s = sat.value, l = lit.value;
    const vars = `:root{--accent-hue:${h};--accent-sat:${s}%;--accent-lit:${l}%}`;
    fetch('./v2ex-export.css')
      .then(r=>r.text())
      .then(base=>{ snippet.value = compressCss(base + "\n" + vars); })
      .catch(()=>{ snippet.value = vars; });
  }

  function setTitleByPresetKey(key){
    const name = (PRESETS[key] && PRESETS[key][3]) || '自定义';
    titleCN.textContent = `主题效果预览：${name}`;
  }

  // localStorage helpers
  const STORAGE_LAST = 'sg:last';
  const STORAGE_SAVED = 'sg:savedThemes';
  function saveLast(){
    try{
      const state = {
        h: +hue.value, s:+sat.value, l:+lit.value,
        preset: presetSel.value,
        night: !!night.checked,
        // 记录当前激活的用户主题名（若有）
        userName: window.__sgActiveUserThemeName || null,
        ts: Date.now(),
      };
      localStorage.setItem(STORAGE_LAST, JSON.stringify(state));
    }catch(e){/* ignore */}
  }
  function loadLast(){
    try{
      const raw = localStorage.getItem(STORAGE_LAST);
      return raw? JSON.parse(raw): null;
    }catch(e){ return null; }
  }
  function loadSavedThemes(){
    try{
      const raw = localStorage.getItem(STORAGE_SAVED);
      const list = raw? JSON.parse(raw): [];
      return Array.isArray(list)? list: [];
    }catch(e){ return []; }
  }
  function saveThemes(list){
    try{ localStorage.setItem(STORAGE_SAVED, JSON.stringify(list)); }
    catch(e){/* ignore */}
  }

  function applyVars(){
    const h = +hue.value, s = +sat.value, l = +lit.value;
    document.documentElement.style.setProperty('--accent-hue', h);
    document.documentElement.style.setProperty('--accent-sat', s + '%');
    document.documentElement.style.setProperty('--accent-lit', l + '%');
    huev.textContent = h; satv.textContent = s + '%'; litv.textContent = l + '%';

    // 滑块变化时，自动匹配预设或标为“自定义”
    let matched = null;
    for(const [k,v] of Object.entries(PRESETS)){ if(equalTrip(v,[h,s,l])){ matched = k; break; } }
    const isUserThemeActive = !!window.__sgActiveUserThemeName;
    presetSel.value = isUserThemeActive ? 'custom' : (matched || 'custom');
    setTitleByPresetKey(presetSel.value);

    updateSnippet();
    // 滑块变化即视为“自定义”，不再维持某个用户主题的激活态
    // 但若正在应用用户主题（程序触发），暂不清空以便 chips 高亮
    if(!matched && !window.__sgApplyingUserTheme){ window.__sgActiveUserThemeName = null; }
    // 持久化最新一次用户记录
    saveLast();
    updateSaveBtn();
  }

  function applyPreset(name){
    if(name==='custom'){ 
      // 仅用于内部状态，不作为按钮存在
      window.__sgActiveUserThemeName = null;
      setTitleByPresetKey('自定义'); updateSnippet(); saveLast(); updateSaveBtn(); return; 
    }
    window.__sgActiveUserThemeName = null;
    const [h,s,l] = PRESETS[name];
    hue.value = h; sat.value = s; lit.value = l;
    setTitleByPresetKey(name);
    applyVars();
    updateSaveBtn();
  }

  function renderNight(){
    if(night.checked){ wrap.classList.add('Night'); } else { wrap.classList.remove('Night'); }
    saveLast();
  }

  // 复制到剪贴板（左侧主按钮 + 文本框悬浮按钮共用）
  async function copyCssText(){
    try{
      await navigator.clipboard.writeText(snippet.value);
      alert('复制成功！ 请前往V2EX使用');
    }catch(err){
      snippet.focus(); snippet.select(); document.execCommand('copy');
      alert('复制成功！ 请前往V2EX使用');
    }
  }

  // 事件绑定
  hue.addEventListener('input', applyVars);
  sat.addEventListener('input', applyVars);
  lit.addEventListener('input', applyVars);
  presetSel.addEventListener('change', e => applyPreset(e.target.value));
  night.addEventListener('change', renderNight);
  document.getElementById('copyCss').addEventListener('click', copyCssText);
  document.getElementById('copyCssFloat').addEventListener('click', copyCssText);
  document.getElementById('reset').addEventListener('click', () => {
    presetSel.value = 'rust';
    applyPreset('rust');
    night.checked = false;
    renderNight();
    saveLast();
    updateSaveBtn();
  });

  // 手动保存为主题（名称≤10）
  if(btnSave){
    btnSave.addEventListener('click', () => {
      let name = prompt('输入主题名称（不超过10字）');
      if(name==null) return; // 用户取消
      name = String(name).trim();
      if(!name){ alert('名称不能为空'); return; }
      if(name.length>10){ alert('名称不超过10个字'); return; }
      const item = { name, h:+hue.value, s:+sat.value, l:+lit.value, ts:Date.now() };
      const list = loadSavedThemes();
      const idx = list.findIndex(x=>x.name===name);
      if(idx>=0){ list[idx] = item; } else { list.push(item); }
      saveThemes(list);
      window.__sgActiveUserThemeName = name;
      // 通知外部刷新 chips
      document.dispatchEvent(new CustomEvent('sg:savedThemesChanged'));
      saveLast();
      updateSaveBtn();
    });
  }

  // 初始化：优先恢复上次使用；否则默认“铁锈橙红”
  (function init(){
    const last = loadLast();
    if(last){
      hue.value = last.h ?? 18;
      sat.value = last.s ?? 66;
      lit.value = last.l ?? 50;
      night.checked = !!last.night;
      window.__sgActiveUserThemeName = last.userName || null;
      if(window.__sgActiveUserThemeName){ window.__sgApplyingUserTheme = true; }
      renderNight();
      applyVars();
      if(window.__sgActiveUserThemeName){ setTimeout(()=>{ window.__sgApplyingUserTheme = false; },0); }
      updateSaveBtn();
      // 通知外部 chips 同步激活态（确保自定义时选中“自定义”而非默认的铁锈）
      try{ presetSel.dispatchEvent(new Event('change', { bubbles: true })); }catch(e){}
    }else{
      applyPreset('rust'); // 默认第一个预设
      night.checked = false;
      renderNight();
      updateSaveBtn();
      try{ presetSel.dispatchEvent(new Event('change', { bubbles: true })); }catch(e){}
    }
  })();
})();
