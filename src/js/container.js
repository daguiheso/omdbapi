'use strict'

import $ from 'jquery'
import page from 'page'
import template from './render'
import request from './request'
import config from './config'

const baseUrl = config.baseUrl
let $container = $('#app-body').find('.wrapper')

// Double click 2 to img card
$container.on('dblclick', '.card-img img', function (ev) {
  let $this = $(this)
  let $card = $this.closest('.card')
  let id = $card.data('id')
  localStorage.setItem('srcImg', $card.find('img').prop('src')) // eslint-disable-line no-undef
  localStorage.setItem('showId', id) // eslint-disable-line no-undef
  let type = $card.data('type')
  if (type === 'series') // eslint-disable-line curly
    page(`/show?i=${id}&Season=1&plot=full`)
})

// Check detail episode
$container.on('click', '.item .check', function (ev) {
  let $this = $(this)
  let $item = $this.closest('.item')
  $item.find('.item-body').toggle('slow')
  $this.addClass('viewed')
  let showId = localStorage.getItem('showId') // eslint-disable-line no-undef
  let season = localStorage.getItem('season') // eslint-disable-line no-undef
  let episode = $item.data('episode')
  let $loader = $('<div class="loader"></div>')
  let $currentItem = $(`.item[data-episode="${episode}"]`).find('.item-body')
  $currentItem.empty().append($loader)

  let busqueda = {
    i: showId,
    Season: season,
    Episode: episode,
    plot: 'full'
  }
  request(`${baseUrl}/`, busqueda, episode => {
    let el = template({ episode })
    $loader.remove()
    $(`.item[data-episode="${episode.Episode}"]`)
      .find('.item-body')
      .append(el)
  })
})

// Roll over card
$container.on('mouseenter mouseleave', '.card--hover', function (ev) {
  let $this = $(this)
  let $card = $this.closest('.card')
  let id = $card.data('id')
  $(`.card[data-id="${id}"]`)
      .find('.card--hover')
      .empty()

  request(`${baseUrl}/`, {i: id}, show => {
    show.Actors = show.Actors.split(',')
    while (show.Actors.length > 3) {
      show.Actors.pop()
    }
    let el = template({hover: show})
    $(`.card[data-id="${id}"]`)
      .find('.card--hover')
      .append(el)
  })
})

export default $container
