'use strict'

import $ from 'jquery'
import page from 'page'
import request from './request'
import template from './render'
import $container from './container'
import './search'
import qs from 'qs'
import config from './config'
import validateSearch from './validations'

const baseUrl = config.baseUrl
const win = $(window)

// Route init
page('/', (ctx, next) => {
  $('#arrow').hide()
  $container.empty()
  let $loader = $('<div class="loader"></div>')
  $loader.appendTo($container)
  let busqueda = {s: 'games', page: 1}
  localStorage.setItem('search', JSON.stringify(busqueda)) // eslint-disable-line no-undef

  request(`${baseUrl}/`, busqueda, shows => {
    $loader.remove()
    let result = template({shows: shows.Search})
    let $result = $(result)
    $container.append($result)
    $result.hide().show('slow')
  })

  win.scroll(() => {
    if (win[0].location.pathname === '/' && $(document).height() - win.height() === win.scrollTop()) {
      let $loader = $('<div class="u-relative"><div class="loader"></div></div>')
      $loader.appendTo($container)
      let busqueda = JSON.parse(localStorage.getItem('search')) // eslint-disable-line no-undef
      busqueda.page++
      localStorage.setItem('search', JSON.stringify(busqueda)) // eslint-disable-line no-undef

      request(`${baseUrl}/`, busqueda, shows => {
        let result = template({shows: shows.Search})
        $loader.remove()
        let $result = $(result)
        $container.append($result)
      })
    }
  })
})

// Route search
page('/search', (ctx, next) => {
  $('#arrow').show()
  $container.empty()
  let $loader = $('<div class="loader"></div>')
  $loader.appendTo($container)
  var busqueda = qs.parse(ctx.querystring)
  localStorage.setItem('search', JSON.stringify(busqueda)) // eslint-disable-line no-undef

  request(`${baseUrl}/`, busqueda, shows => {
    if (shows.Response === 'true' || shows.Response === 'True') {
      let result = template({shows: shows.Search})
      let $result = $(result)
      $container.append($result)
      $result.hide().show('slow')
    } else {
      validateSearch(null, shows.Error)
    }
    $loader.remove()
  })

  win.scroll(() => {
    if (win[0].location.pathname === '/search' && $(document).height() - win.height() === win.scrollTop()) {
      let $loader = $('<div class="u-relative"><div class="loader"></div></div>')
      $loader.appendTo($container)
      let busqueda = JSON.parse(localStorage.getItem('search')) // eslint-disable-line no-undef
      busqueda.page++
      localStorage.setItem('search', JSON.stringify(busqueda)) // eslint-disable-line no-undef

      request(`${baseUrl}/`, busqueda, shows => {
        let result = template({shows: shows.Search})
        $loader.remove()
        let $result = $(result)
        $container.append($result)
      })
    }
  })
})

// Route get show
page('/show', (ctx, next) => {
  $('#arrow').show()
  $container.empty()
  let $loader = $('<div class="loader"></div>')
  $loader.appendTo($container)
  const busqueda = qs.parse(ctx.querystring)

  request(`${baseUrl}/`, busqueda, show => {
    $loader.remove()
    let result = template({show})
    let $result = $(result)
    $container.append($result)
    $result.hide().show('slow')
  })
})

page()
