console.log('main.js loaded');
document.addEventListener('submit', async (e) => {
  const form = e.target.closest('form[data-section]');
  if (!form) {return; }                // ignora otros formularios
  e.preventDefault();                // evita recargar la página
  console.log('submit caught:', form.dataset.section);

  form.querySelectorAll('.field-error').forEach(el => el.textContent = '');

  const res = await fetch(`/athlete/${form.dataset.section}`, {
    method: 'POST',
    body: new URLSearchParams(new FormData(form))
  });
  const data = await res.json();
  console.log('server answered:', res.status, data);

  if (!res.ok) {
    for (const [field, msg] of Object.entries(data.errors || {})) {
      const el = form.querySelector(`[data-error-for="${field}"]`);
      if (el) {el.textContent = msg;}
    }
    return;
  }

  const nextTab = document.querySelector(`#tab-${data.next}`);
  if (nextTab) {
    nextTab.disabled = false;
    nextTab.click();
  }
});

/*const btnDelete = document.getElementsByClassName('btn-delete');






//eliminar menu works
Array.from(btnDelete).forEach(function(element) {
  element.addEventListener('click', async function(){
    if (!confirm('Delete this menu?')) {return;}
    try{
      const respuesta = await fetch(`/menu/${element.dataset.id}`, {
        method: 'delete'});
      if(!respuesta.ok) {throw new Error('Couldn\'t delete');}
      window.location.reload();
    }catch(err){
      console.error(err.message);
          
    }
  });
});*/
