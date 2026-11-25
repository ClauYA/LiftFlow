//guarda en un nodelist(no tiene todos sus metodos) el nodelist de elementos contiene todo lo que tenga role=tab
//y array from la convierte en un array de verdad
const tabs   = Array.from(document.querySelectorAll('[role="tab"]'));
//lo mismo q role=tab pero con tabpanel
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));



//funcion q recibe el nombre del tab y un dato optional
function showTab(id, focus) {
    //loop through the bottons 
  tabs.forEach(function (tab) {
    //compara si dataset es igual al id
    const on = tab.dataset.tab === id;
    //pone en true el boton elegido y falso en los demas
    tab.setAttribute('aria-selected', on ? 'true' : 'false');
    //0 para q sea accesible y -1 para q se salte 
    tab.tabIndex = on ? 0 : -1;
    //si es verdad mueve el cursor a el (caso flechas)
    if (on && focus) 
        tab.focus();
  });
  //recorre el resto de los paneles ocultos excepto el q tiene data-panel=id
  panels.forEach(function (panel) {
    panel.hidden = panel.dataset.panel !== id;
  });
}

//recorre the buttons again but with two datas tab and 0,1,2,3
tabs.forEach(function (tab, i) {
//cuando se hace click se llama a showtab function
  tab.addEventListener('click', function () { showTab(tab.dataset.tab); });
  tab.addEventListener('keydown', function (e) {
    let next = null;
    if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft')  next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (next) { e.preventDefault(); showTab(next.dataset.tab, true); }
  });
});

// ----- Forms: uno por tab, todos usan el mismo manejador -----
document.querySelectorAll('form[data-section]').forEach(function (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    form.querySelectorAll('[data-error-for]').forEach(function (el) { el.textContent = ''; });

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;

    try {
      const fd = new FormData(form);
      const data = {};
      for (const key of new Set(fd.keys())) {
        const values = fd.getAll(key);
        data[key] = values.length > 1 ? values : values[0];
      }

      const res  = await fetch('/athlete/' + form.dataset.section, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          Object.entries(json.errors).forEach(function ([field, msg]) {
            const el = form.querySelector('[data-error-for="' + field + '"]');
            if (el) el.textContent = msg;
          });
        } else {
          alert(json.error || 'Something went wrong');
        }
        return;
      }

      if (json.next) showTab(json.next);
    } catch (err) {
      alert('Could not reach the server');
    } finally {
      button.disabled = false;
    }
  });
});