const NAME = 0;   // position of the name (genre name or artist name)
const ITEMS = 1;  // position of the inner array (artists of a genre, or songs of an artist)

const library = [
  ["Pop", [
    ["Taylor Swift", ["Shake It Off", "Blank Space", "Anti-Hero", "Cruel Summer"]],
    ["Dua Lipa", ["Levitating", "Don't Start Now", "New Rules", "Houdini"]],
    ["Harry Styles", ["As It Was", "Watermelon Sugar", "Adore You"]],
    ["Coldplay", ["Viva La Vida", "A Sky Full of Stars"]],
    ["Daft Punk", ["Get Lucky"]]
  ]],

  ["Hip-Hop", [
    ["Kendrick Lamar", ["HUMBLE.", "Alright", "Not Like Us"]],
    ["Drake", ["God's Plan", "Hotline Bling", "One Dance"]],
    ["Eminem", ["Lose Yourself", "Without Me", "Mockingbird"]],
    ["OutKast", ["Hey Ya!", "Ms. Jackson", "Roses"]]
  ]],

  ["Deep House",[
    ["Because of Art",["Circle of Light","Hold on","Fied Up"]],
    ["Ivan Issa",["Serenidade","Shine","No Logo"]],
    ["Marsh",["Come Together","Nemora","All Night Long"]],
  ]],

  ["Electronic", [
    ["Daft Punk", ["Get Lucky", "One More Time", "Around the World", "Harder, Better, Faster, Stronger"]],
    ["Avicii", ["Wake Me Up", "Levels", "The Nights"]],
    ["Calvin Harris", ["Summer", "Feel So Close", "One Kiss"]],
    ["Disclosure", ["Latch", "White Noise"]]
  ]],

  ["Irish", [
    ["U2", ["With or Without You", "One", "Beautiful Day"]],
    ["The Cranberries", ["Zombie", "Linger", "Dreams"]],
    ["Thin Lizzy", ["Whiskey in the Jar", "The Boys Are Back in Town"]],
    ["Hozier", ["Take Me to Church", "Work Song"]],
    ["Westlife",["My life","I Lay My Love on You"]]
  ]]
];

const genreListEl = document.getElementById("genreList");
const trackCountEl = document.getElementById("trackCount");
const availableInfoEl = document.getElementById("availableInfo");
const generateBtn = document.getElementById("generateBtn");
const selectAllBtn = document.getElementById("selectAllBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const playlistEl = document.getElementById("playlist");
const playlistTitleEl = document.getElementById("playlistTitle");
const messageEl = document.getElementById("message");

let playlistNumber = 0;


function buildGenreCheckboxes() {
 // console.log(library)
  library.forEach(function (genre, index) {
    const label = document.createElement("label");
    label.className = "genre-chip";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = index;
    checkbox.checked = true; // all genres selected by default
    checkbox.addEventListener("change", updateAvailableInfo);
//console.log(genre[NAME]);
    label.appendChild(checkbox);
    label.append(genre[NAME]);
    genreListEl.appendChild(label);
  });
}


function getSelectedGenres() {
  const checkboxes = genreListEl.querySelectorAll("input[type='checkbox']");
  const selected = [];

  checkboxes.forEach(function (box) {
    if (box.checked) {
      selected.push(Number(box.value));
    }
  });

  return selected;
}


function collectSongs(genreIndexes) {
  const songs = [];  // the songs we will return
  const keys = [];   // "artist - song" strings, used to spot duplicates quickly

  for (let g = 0; g < genreIndexes.length; g++) {
    const genre = library[genreIndexes[g]];
    const genreName = genre[NAME];
    const artists = genre[ITEMS];

    for (let a = 0; a < artists.length; a++) {
      const artistName = artists[a][NAME];
      console.log(artistName);
      const artistSongs = artists[a][ITEMS];

      for (let s = 0; s < artistSongs.length; s++) {
        const title = artistSongs[s];
        const key = artistName + " - " + title;
        const position = keys.indexOf(key);

        if (position === -1) {
          // New song: add it
          keys.push(key);
          songs.push([title, artistName, [genreName]]);
        } else {
          // Duplicate: skip it, but remember it also belongs to this genre
          songs[position][2].push(genreName);
          console.log("Duplicate skipped:", key, "(also in " + genreName + ")");
        }
      }
    }
  }

  return songs;
}

/**
 * Picks `count` random songs from the pool, each song at most once.
 *
 * We work on a COPY of the pool, so the original array is not changed.
 * A shallow copy ([...pool]) is enough here, because we only remove
 * top-level items with splice() – we never change the inner arrays.
 * Once a song is spliced out of the copy it cannot be picked again,
 * so the playlist can never contain the same song twice.
 */
function pickRandomSongs(pool, count) {
  const available = [...pool];
  const playlist = [];

  while (playlist.length < count && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const pickedSong = available.splice(randomIndex, 1)[0];
    playlist.push(pickedSong);
  }

  return playlist;
}

/**
 * Writes the playlist to the page as list items.
 */
function renderPlaylist(playlist) {
  playlistEl.innerHTML = ""; // clear the previous playlist

  playlist.forEach(function (song) {
    const title = song[0];
    const artist = song[1];
    const genres = song[2];

    const li = document.createElement("li");

    const info = document.createElement("div");
    const titleEl = document.createElement("span");
    titleEl.className = "song";
    titleEl.textContent = title;
    const artistEl = document.createElement("span");
    artistEl.className = "artist";
    artistEl.textContent = artist;
    info.appendChild(titleEl);
    info.appendChild(artistEl);

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = genres.join(" / "); // join() turns the array into one string

    li.appendChild(info);
    li.appendChild(tag);
    playlistEl.appendChild(li);
  });
}

/**
 * Shows how many unique songs are available for the selected genres
 * and stops the number input from going above that.
 */
function updateAvailableInfo() {
//  console.log(collectSongs);
  const total = collectSongs(getSelectedGenres()).length;
  availableInfoEl.textContent = total + " unique songs available in the selected genres.";
  trackCountEl.max = Math.max(total, 1);
}

/**
 * Shows a message above the playlist. isWarning = true makes it orange.
 */
function showMessage(text, isWarning) {
  messageEl.textContent = text;
  messageEl.classList.toggle("warning", isWarning);
}

/**
 * Runs when the "Generate playlist" button is clicked.
 */
function generatePlaylist() {
  const selectedGenres = getSelectedGenres();

  // 1. At least one genre must be chosen
  if (selectedGenres.length === 0) {
    playlistEl.innerHTML = "";
    showMessage("Please choose at least one genre.", true);
    return;
  }

  // 2. Get all unique songs from those genres
  const pool = collectSongs(selectedGenres);

  // 3. Read and check the number of tracks the user asked for
  let count = parseInt(trackCountEl.value, 10);
  if (isNaN(count) || count < 1) {
    count = 1;
    trackCountEl.value = 1;
  }

  // 4. Pick the songs and show them
  const playlist = pickRandomSongs(pool, count);
  renderPlaylist(playlist);

  playlistNumber++;
  const genreNames = selectedGenres.map(function (i) {
    return library[i][NAME];
  });
  playlistTitleEl.textContent = "Playlist #" + playlistNumber;

  if (count > pool.length) {
    showMessage(
      "You asked for " + count + " tracks, but there are only " + pool.length +
      " unique songs in these genres, so the playlist has " + playlist.length + ".",
      true
    );
  } else {
    showMessage(playlist.length + " tracks from: " + genreNames.join(", "), false);
  }

  console.log("Playlist #" + playlistNumber, playlist);
}

// ---------------------------------------------------------------------------
// START: set up the page and the event listeners
// ---------------------------------------------------------------------------
buildGenreCheckboxes();
updateAvailableInfo();

generateBtn.addEventListener("click", generatePlaylist);

selectAllBtn.addEventListener("click", function () {
  genreListEl.querySelectorAll("input").forEach(function (box) {
    box.checked = true;
  });
  updateAvailableInfo();
});

clearAllBtn.addEventListener("click", function () {
  genreListEl.querySelectorAll("input").forEach(function (box) {
    box.checked = false;
  });
  updateAvailableInfo();
});
