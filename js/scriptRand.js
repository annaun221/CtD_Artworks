//Setting a general API adress for different artworks
const randAPI = "https://api.artic.edu/api/v1/artworks";

// Getting image URL
function imgUrl(image_id, width = 600) {
  return `https://www.artic.edu/iiif/2/${image_id}/full/${width},/0/default.jpg`;
}

//Function to get total number of pages
async function getTotalPages() {
  const results = await fetch(`${randAPI}?limit=1&fields=id`);
  const data = await results.json();
  return data.pagination?.total_pages || 1;
}

//Fetches one random art id and displays information about it
async function loadRandomImage() {
  const status = document.getElementById("status");
  const container = document.getElementById("imageContainer");
  status.textContent = "Loading...";
  container.innerHTML = "";

try {
  //Gets total number of pages and selecting random one
  const totalPages = await getTotalPages();
  const randomPage = Math.floor(Math.random() * totalPages) + 1;

  //fetching 1 random artwork and its information
  const res = await fetch(`${randAPI}?page=${randomPage}&limit=1&fields=id,title,image_id,artist_title,date_display,artwork_type_title,provenance_text`);
  const data = await res.json();
  const artwork = data.data[0];

  //Displays image
  const img = document.createElement("img");
  img.src = imgUrl(artwork.image_id, 600);
  img.alt = "";

  //Displays information
  const info = document.createElement("div");
  info.innerHTML = 
    `<h2>${artwork.title || "Untitled"}</h2>
    <h3>
      <a href="artist.html?name=${encodeURIComponent(artwork.artist_title)}" class="artist-link">${artwork.artist_title || "Unknown"} </a> - 
      ${artwork.date_display || "n.d."}
    </h3>
    <p><strong>Type of work:</strong><br>${artwork.artwork_type_title || "Unknown"}</p>
    <p><strong>History of ownership:</strong><br>${artwork.provenance_text || "Unknown"}</p>
    <a href="https://www.artic.edu/artworks/${artwork.id}" target="_blank" class="art-link">Learn More About the Artwork</a>`;

  //displays everything in webpage
  container.appendChild(img);
  container.appendChild(info);
  status.textContent = "Here is Your Artwork!";

  } catch (err) {
    console.error(err);
    status.textContent = "Error loading image: " + err.message;
  }
}

//Fetching API using button
document.getElementById("randButton").addEventListener("click", loadRandomImage);
loadRandomImage();