'use strict'

import $ from 'jquery'

module.exports = function request (url, busqueda, fn) {
  if (url && !busqueda) {
    $.ajax({
      url: url
    }).done((data, textStatus, xhr) => {
      fn(data.Search)
    })
  }
  if (url && busqueda) {
    $.ajax({
      url: `${url}`,
      data: busqueda
    }).done((shows, textStatus, xhr) => {
      fn(shows)
    })
  }
}
