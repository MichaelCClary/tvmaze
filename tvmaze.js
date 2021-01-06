/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(q) {
  const showArr = [];
  const res = await axios.get("http://api.tvmaze.com/search/shows", { params: { q } })

  for (let shows of res.data) {
    if (shows.show.image == null) {
      shows.show.image = { original: "https://tinyurl.com/tv-missing" }
    }
    const obj = {
      id: shows.show.id,
      name: shows.show.name,
      summary: shows.show.summary,
      image: shows.show.image.original
    }
    showArr.push(obj);
  }

  return showArr;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="btn btn-primary" id=${show.id}>Episodes</button>
         </div>
       </div>
      `);

    $showsList.append($item);

    const button = document.getElementById(show.id);
    button.addEventListener('click', function (e) {
      getEpisodes(show.id);
    })
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const episodeArr = [];
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  for (let episode of res.data) {
    const obj = {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    }
    episodeArr.push(obj);
  }
  populateEpisodes(episodeArr);
}

function populateEpisodes(show) {
  const $episode = $("#episodes-list");
  $episode.empty();

  for (let episode of show) {
    let $li = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number} )</li>`
    );

    $episode.append($li);
  }
  $("#episodes-area").show();
}