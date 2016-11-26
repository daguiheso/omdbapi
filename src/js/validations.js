'use strict'

import $ from 'jquery'
import page from 'page'
import yo from 'yo-yo'
import $container from './container'

export default function validate (busqueda, error) {
  // Render alert error
  function render (message) {
    let el = yo`
      <div class="alert">
        <span class="closebtn"><i class="fa fa-times-circle exit" aria-hidden="true"></i></span>
        ${message.error}
      </div>`

    let $el = $(el)
    $('#alerts').empty().append($el)
  }

  // Close alert error
  $('#alerts').on('click', '.exit', function (ev) {
    let $this = $(this)
    let $item = $this.closest('.alert')
    $item.hide('fast')
    $container.empty()
  })

  // Symbols validate
  if (busqueda) {
    let matchesSymbols = busqueda.match(/[-@#!$%^&*()_+|~=`{}\[\]:";'<>?¿,.\/]/g)

    if (matchesSymbols) // eslint-disable-line curly
      render({error: 'Los caracteres especiales no son permitidos en una busqueda!'})
    else if (busqueda === '') // eslint-disable-line curly
      render({error: 'Tu busqueda es vacia, vuelve a intentarlo'})
    else // eslint-disable-line curly
      page(`/search?s=${busqueda}&page=1`)
  }
  if (error) {
    if (error === 'Too many results.') // eslint-disable-line curly
      render({error: 'Se mas especifico, tu busqueda arroja muchos resultados!'})
    else if (error === 'Must provide more than one character.') // eslint-disable-line curly
      render({error: 'Demasiado corta la busqueda, intenta nuevamente!'})
    else if (error === 'Movie not found!') // eslint-disable-line curly
      render({error: 'Pelicula no encontrada!'})
  }
}
