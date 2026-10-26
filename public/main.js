const thumbUp = document.getElementsByClassName("fa-thumbs-up");
const thumbDown = document.getElementsByClassName("fa-thumbs-down");
const trash = document.getElementsByClassName("fa-trash-o fa-lg");
const btnDelete = document.getElementsByClassName("btn-delete");
const btnEdit = document.getElementsByClassName("btn-edit");
const cuadroDeDialogo =  document.getElementById('dialog-edit-menu');
const formEditMenu = document.getElementById('form-edit-menu');
const toggleMenu = document.getElementById('toggle-menu');


//no por ahora
/*if (toggleMenu) {
  toggleMenu.addEventListener('click', () => {
    const hidden = document.querySelectorAll('.card.is-hidden, .card.was-hidden')
    const expanding = toggleMenu.dataset.open !== 'true'
    hidden.forEach(card => {
      card.classList.toggle('is-hidden', !expanding)
      card.classList.toggle('was-hidden', expanding)
    })
    toggleMenu.dataset.open = expanding
    toggleMenu.textContent = expanding ? 'Show less' : 'View full menu'
  })
}*/

//editar en cuadro de dialogo
Array.from(btnEdit).forEach(function(element) {
     element.addEventListener('click', function () {
        const objeto =element.closest('tr').children
        formEditMenu.firstElementChild.value = element.dataset.id
        formEditMenu.category.value = objeto[0].textContent
        formEditMenu.title.value = objeto[1].textContent
        formEditMenu.description.value = objeto[2].textContent
        formEditMenu.price.value = objeto[3].textContent.replace('$', '')
        cuadroDeDialogo.showModal()
     })
});

//este es mi boton para la cancelacion del update en el cuadro de dialogo
document.getElementById('edit-cancel').addEventListener('click', () => dialog.close());

formEditMenu.addEventListener('submit', async function (e) {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(formEditMenu))
  const id = data.itemId
  delete data.itemId
  data.price = Number(data.price)

  try {
    const respuesta = await fetch(`/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!respuesta.ok) throw new Error("Couldn't update")
    window.location.reload()
  } catch (err) {
    console.error(err.message)
    alert(err.message)
  }
})



//eliminar menu works
Array.from(btnDelete).forEach(function(element) {
      element.addEventListener('click', async function(){
        if (!confirm('Delete this menu?')) return
        try{
          const respuesta = await fetch(`/menu/${element.dataset.id}`, {
          method: 'delete'})
          if(!respuesta.ok) throw new Error("Couldn't delete")
            window.location.reload()
        }catch(err){
          console.error(err.message)
          
        }
      })
});
