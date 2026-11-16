/* CONFIGURACIÓN DEL CONTADOR DE RESERVAS
   reservasInicial: número con el que arranca
   cadaMs: cada cuántos milisegundos sube (3000 = cada 3 segundos)
   sumaMax: cuánto puede subir como máximo cada vez (sube entre 1 y este número) */
var CONFIG={reservasInicial:20405164,cadaMs:3000,sumaMax:3};

(function(){
  var $=function(i){return document.getElementById(i)};
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CFG={
    ps:{store:'PLAYSTATION STORE - VINCULAR CUENTA',title:'Ingresá tu PSN ID',ph:'Tu PSN ID',name:'PlayStation 5'},
    xb:{store:'XBOX - VINCULAR CUENTA',title:'Ingresá tu Gamertag',ph:'Tu Gamertag',name:'Xbox Series X/S'}
  };
  var cur='ps';

  /* Cuenta regresiva */
  var target=new Date(2026,10,19,0,0,0).getTime();
  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    var t=Math.max(0,target-Date.now()),s=Math.floor(t/1000);
    $('d').textContent=pad(Math.floor(s/86400));
    $('h').textContent=pad(Math.floor(s%86400/3600));
    $('m').textContent=pad(Math.floor(s%3600/60));
    $('s').textContent=pad(s%60);
  }
  tick();setInterval(tick,1000);

  /* Contador de reservas */
  var res=CONFIG.reservasInicial;
  $('res').textContent=res.toLocaleString('es-AR');
  setInterval(function(){res+=1+Math.floor(Math.random()*CONFIG.sumaMax);$('res').textContent=res.toLocaleString('es-AR')},CONFIG.cadaMs);

  /* Popup */
  var lastBtn=null;
  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt)e.textContent=txt;return e}
  function openModal(p,btn){
    cur=p;lastBtn=btn;var c=CFG[p];
    $('modal').className='modal '+p;
    $('mt').textContent=c.store;
    var mb=$('mb');mb.textContent='';
    var back=el('button','back','← Volver a ediciones');back.type='button';back.onclick=closeModal;
    var h=el('h2','',c.title);
    var pr=el('p');pr.append('Vincularemos la ');pr.append(el('b','','Edición Standard'));pr.append(' a este perfil el día del lanzamiento.');
    var row=el('div','row');
    var inp=el('input');inp.type='text';inp.id='nick';inp.placeholder=c.ph;inp.maxLength=32;inp.autocomplete='off';inp.setAttribute('aria-label',c.ph);
    var go=el('button','go','Buscar');go.type='button';go.id='go';
    row.append(inp,go);
    var err=el('p','err');err.id='err';err.setAttribute('role','alert');
    mb.append(back,h,pr,row,err);
    function submit(){
      var v=inp.value.trim();
      if(!v){err.textContent='Escribí un nickname para continuar.';inp.focus();return}
      err.textContent='';go.disabled=true;go.textContent='Buscando...';
      setTimeout(function(){success(v)},900);
    }
    go.onclick=submit;
    inp.onkeydown=function(e){if(e.key==='Enter')submit()};
    $('ov').hidden=false;
    setTimeout(function(){inp.focus()},50);
  }
  function closeModal(){$('ov').hidden=true;if(lastBtn)lastBtn.focus()}
  function success(nick){
    var c=CFG[cur],mb=$('mb');mb.textContent='';
    var ok=el('div','ok');
    ok.innerHTML='<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="30"/><path d="M27 41l9 9 18-20"/></svg>';
    var h=el('h2','','¡Precompra completada!');
    var p=el('p');
    p.append('Edición Standard vinculada a ');
    var b=el('b','',nick);b.style.color='#fff';p.append(b);
    p.append(' en '+c.name+'. Nos vemos en Vice City el 19 de noviembre.');
    var done=el('button','go','Listo');done.type='button';done.onclick=closeModal;
    ok.append(h,p,done);mb.append(ok);
    done.focus();
    celebrate();
  }
  document.querySelectorAll('.plat').forEach(function(b){b.addEventListener('click',function(){openModal(b.dataset.p,b)})});
  $('close').onclick=closeModal;
  $('ov').addEventListener('mousedown',function(e){if(e.target===$('ov'))closeModal()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('ov').hidden)closeModal()});

  /* Festejo: confeti + fuegos artificiales */
  var cv=$('fx'),cx=cv.getContext('2d'),parts=[],run=false,COL=['#ff4f9a','#ffa14a','#38d6e8','#ffd84a','#b36bff','#ffffff'];
  function size(){cv.width=innerWidth;cv.height=innerHeight}
  size();addEventListener('resize',size);
  function confetti(x,y,ang,n,spread,pow){
    for(var i=0;i<n;i++){
      var a=ang+(Math.random()-.5)*spread,v=pow*(.5+Math.random()*.6);
      parts.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:6+Math.random()*7,h:4+Math.random()*5,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:COL[i%COL.length],g:.28,life:140+Math.random()*80,spark:false});
    }
  }
  function firework(x,y){
    var col=COL[Math.floor(Math.random()*5)];
    for(var i=0;i<46;i++){
      var a=Math.PI*2*i/46,v=2+Math.random()*4.5;
      parts.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:3,h:3,r:0,vr:0,c:col,g:.06,life:60+Math.random()*30,spark:true,max:90});
    }
  }
  function loop(){
    cx.clearRect(0,0,cv.width,cv.height);
    parts=parts.filter(function(p){return p.life>0&&p.y<cv.height+40});
    parts.forEach(function(p){
      p.vy+=p.g;p.vx*=p.spark?.985:.992;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.life--;
      cx.globalAlpha=Math.min(1,p.life/(p.spark?30:40));
      cx.fillStyle=p.c;
      if(p.spark){cx.beginPath();cx.arc(p.x,p.y,p.w/2,0,7);cx.fill()}
      else{cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cx.restore()}
    });
    cx.globalAlpha=1;
    if(parts.length)requestAnimationFrame(loop);else run=false;
  }
  function start(){if(!run){run=true;requestAnimationFrame(loop)}}
  function celebrate(){
    var W=innerWidth,H=innerHeight;
    if(reduce){confetti(W/2,H*.4,-Math.PI/2,60,Math.PI,9);start();return}
    confetti(0,H,-Math.PI/3,90,.9,17);confetti(W,H,-Math.PI*2/3,90,.9,17);start();
    [300,700,1100,1500].forEach(function(t,i){
      setTimeout(function(){
        firework(W*(.2+Math.random()*.6),H*(.15+Math.random()*.3));
        if(i%2===0){confetti(W*Math.random(),-10,Math.PI/2,50,1.2,3)}
        start();
      },t);
    });
    setTimeout(function(){confetti(W/2,H*.55,-Math.PI/2,120,Math.PI*1.2,14);start()},1900);
  }
})();
