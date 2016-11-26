'use strict'

import yo from 'yo-yo'
import request from './request'
import config from './config'

const baseUrl = config.baseUrl

module.exports = function render (options) {
  let el
  let showId = localStorage.getItem('showId') // eslint-disable-line no-undef

  function renderShows (shows) {
    return yo`
      ${shows.map(show => {
        return yo`
            <div data-id=${show.imdbID} data-type=${show.Type} class="card">
              <div class="card-img">
                <img src="${show.Poster !== 'N/A' ? show.Poster : 'http://hdimagesnew.com/wp-content/uploads/2016/09/image-not-found.png'}" alt="">
              </div>
              <h3 class="card-title">${show.Title}</h3>
              <div class="card--hover"></div>
            </div>`
      })}`
  }

  function renderShow (show) {
    let srcImg = localStorage.getItem('srcImg') // eslint-disable-line no-undef
    show.totalSeasons = parseInt(show.totalSeasons)
    show.arraySeasons = []
    for (var i = 1; i <= show.totalSeasons; i++) {
      show.arraySeasons.push(i)
    }

    return yo`
      <div class="u-flex">
        <div class="detailCard">
          <div class="detailCard-img">
            <img src="${srcImg}" alt="">
          </div>
          <h3 class="detailCard-title">${show.Title}</h3>
        </div>
        <div data-id=${showId} class="detailInfo">
          <h2 class="detailInfo-title">SEASONS</h2>
          <ul class="detailInfo-listSeasons">
            ${show.arraySeasons.map(season => {
              return yo`
                <li onclick=${update.bind(null, season)} class="item">
                  ${season}
                </li>`
            })}
          </ul>
          <ul class="detailInfo-listEpisodes">
            ${show.Episodes.map(episode => {
              return yo`
                <li data-episode=${episode.Episode} class="item">
                  <div class="item-header">
                    <div class="num">${episode.Episode}</div>
                    <h4 class="title">${episode.Title}</h4>
                    <div class="check"></div>
                  </div>
                  <div class="item-body"></div>
                </li>`
            })}
          </ul>
        </div>
      </div>`
  }

  function renderEpisode (episode) {
    return yo`
      <div>
        <h6 class="date">Aired on <span>${episode.Released}</span></h5>
        <p class="description">
          ${episode.Plot}
        </p>
        <div class="footer">
          <div class="ratink">
            <i class="fa fa-heart" aria-hidden="true"></i> ${episode.imdbRating * 10}%
          </div>
          <ul class="social">
            <li class="social-item">
              <a href="">
                <i class="fa fa-facebook" aria-hidden="true"></i>
              </a>
            </li>
            <li class="social-item">
              <a href="">
                <i class="fa fa-twitter" aria-hidden="true"></i>
              </a>
            </li>
            <li class="social-item">
              <a href="">
                <i class="fa fa-pinterest" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>`
  }

  function renderHoverCard (show) {
    return yo`
      <div class="content">
        <div class="content-rating">${show.imdbRating}</div>
        <ul class="content-list">
          ${show.Actors.map(actor => {
            return yo`
              <li class="content-list-item">${actor}</li>`
          })}
        </ul>
      </div>`
  }

  function update (season, e) {
    localStorage.setItem('season', season) // eslint-disable-line no-undef
    let busqueda = {
      i: showId,
      Season: season,
      plot: 'full'
    }
    request(`${baseUrl}/`, busqueda, show => {
      let newEl = renderShow(show)
      yo.update(el, newEl)
    })
  }

  if (options.shows) // eslint-disable-line curly
    el = renderShows(options.shows)
  else if (options.show) // eslint-disable-line curly
    el = renderShow(options.show)
  else if (options.episode) // eslint-disable-line curly
    el = renderEpisode(options.episode)
  else if (options.hover) // eslint-disable-line curly
    el = renderHoverCard(options.hover)

  return el
}
