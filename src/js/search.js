'use strict'

import $ from 'jquery'
import validateSearch from './validations'

let $searchForm = $('#app-body').find('.search-form')
let $searchButton = $('#app-header').find('.header-opts .search')

// Toggle visibility search input
$searchButton.on('click', function (ev) {
  ev.preventDefault()
  $searchForm.slideToggle('slow')
})

// Submit form
$('#app-body')
  .find('form')
  .submit(function (ev) {
    ev.preventDefault()
    let busqueda = $(this)
      .find('input[type="text"]')
      .val()

    validateSearch(busqueda)
  })
