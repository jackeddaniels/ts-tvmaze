import jQuery from 'jquery';

const $ = jQuery;

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const BASE_URL = 'https://api.tvmaze.com';
const ALTERNATE_IMG_URL = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F2d%2F0e%2Fb6%2F2d0eb6cdb8a4c77c25bb5460084ecffd.png&f=1&nofb=1&ipt=653643550e3764f8fb2fe84b94bfa8e370b2864c0a0e1cbdf10534ba3ce65230&ipo=images';

interface ShowInterface {
  id: number,
  name: string,
  summary: string,
  image: ImageInterface | null //FIXME: could be a string?
}
interface ResponseInterface {
  show: ShowInterface
}
interface ImageInterface {
  medium: string
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function searchShowsByTerm(term: string) : Promise<ShowInterface[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const params: URLSearchParams = new URLSearchParams({ q: term });
  const endpoint: string = `${BASE_URL}/search/shows?${params}`;
  const response: Response = await fetch(endpoint);
  const data: ResponseInterface[] = await response.json();

  console.log("getShowsByTerm data=", data);
  const shows : ShowInterface[] = data.map(function (showAndRatingObject) {
    return {
      id: showAndRatingObject.show.id,
      name: showAndRatingObject.show.name,
      summary: showAndRatingObject.show.summary,
      image: showAndRatingObject.show.image ? showAndRatingObject.show.image.medium : ALTERNATE_IMG_URL,
    };
  });
  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg"
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await searchShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }