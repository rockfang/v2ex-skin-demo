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

  function applyVars(){
    const h = +hue.value, s = +sat.value, l = +lit.value;
    document.documentElement.style.setProperty('--accent-hue', h);
    document.documentElement.style.setProperty('--accent-sat', s + '%');
    document.documentElement.style.setProperty('--accent-lit', l + '%');
    huev.textContent = h; satv.textContent = s + '%'; litv.textContent = l + '%';

    // 滑块变化时，自动匹配预设或标为“自定义”
    let matched = null;
    for(const [k,v] of Object.entries(PRESETS)){ if(equalTrip(v,[h,s,l])){ matched = k; break; } }
    presetSel.value = matched || 'custom';
    setTitleByPresetKey(presetSel.value);

    updateSnippet();
  }

  function applyPreset(name){
    if(name==='custom'){ setTitleByPresetKey('custom'); updateSnippet(); return; }
    const [h,s,l] = PRESETS[name];
    hue.value = h; sat.value = s; lit.value = l;
    setTitleByPresetKey(name);
    applyVars();
  }

  function renderNight(){
    if(night.checked){ wrap.classList.add('Night'); } else { wrap.classList.remove('Night'); }
  }

  // 复制到剪贴板（左侧主按钮 + 文本框悬浮按钮共用）
  async function copyCssText(){
    try{
      await navigator.clipboard.writeText(snippet.value);
      alert('已复制完整 CSS 到剪贴板！');
    }catch(err){
      snippet.focus(); snippet.select(); document.execCommand('copy');
      alert('已复制（兼容模式）');
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
  });

  // 初始化：默认“铁锈橙红”
  applyPreset('rust');
})();
