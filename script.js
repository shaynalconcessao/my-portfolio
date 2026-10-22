/* =========================================
   ARTWORK DATABASE
========================================= */

const artworks = [];


// Create 70 artworks automatically
for (let i = 1; i <= 70; i++) {

    artworks.push({

        id: `art${i}`,

        image: `artworks/Artwork ${i}.jpg`,

        title: `Artwork ${i}`,

        description: `One of Shayna's original artworks.`,

        category:
            i <= 57
                ? "drawing"
                : i <= 61
                    ? "watercolor"
                    : "acrylic"

    });

}


/* =========================================
   GALLERY
========================================= */

const gallery = document.getElementById("art-grid");


function displayGallery(category = "all") {

    if (!gallery) return;

    gallery.innerHTML = "";

    const filteredArtworks =
        category === "all"
            ? artworks
            : artworks.filter(
                artwork => artwork.category === category
            );


    filteredArtworks.forEach(artwork => {

        const card = document.createElement("div");

        card.className = `art-card ${artwork.category}`;

        card.onclick = () => {

            openLightbox(
                artwork.image,
                artwork.title,
                artwork.description,
                artwork.id
            );

        };


        card.innerHTML = `

            <img
            src="${artwork.image}"
            alt="${artwork.title}"
            loading="lazy"
            onerror="if (!this.dataset.triedJpeg) {
        this.dataset.triedJpeg = 'true';
        this.src = this.src.replace(/\.jpg$/i, '.jpeg');
    }"
>

            <div class="art-overlay">

                <h3>
                    ${artwork.title}
                </h3>

                <p>
                    ${formatCategory(artwork.category)}
                </p>

            </div>

        `;


        gallery.appendChild(card);

    });

}


function formatCategory(category) {

    if (category === "drawing")
        return "Drawing & Sketch";

    if (category === "acrylic")
        return "Acrylic Painting";

    if (category === "watercolor")
        return "Watercolor";

    return category;

}


/* =========================================
   FILTERS
========================================= */

function filterGallery(category, button) {

    document
        .querySelectorAll(".filter-btn")
        .forEach(btn => {
            btn.classList.remove("active");
        });


    if (button) {
        button.classList.add("active");
    }


    displayGallery(category);

}


/* =========================================
   LIGHTBOX
========================================= */

let currentArtwork = null;


function openLightbox(image, title, description, id) {

    currentArtwork = id;

    document.getElementById("lightbox-img").src = image;

    document.getElementById("lightbox-title").textContent = title;

    document.getElementById("lightbox-desc").textContent = description;


    updateLikes();

    displayComments();


    document
        .getElementById("lightbox")
        .classList.add("show");


    document.body.style.overflow = "hidden";

}


function closeLightbox() {

    document
        .getElementById("lightbox")
        .classList.remove("show");


    document.body.style.overflow = "auto";

}


/* =========================================
   LIKES
========================================= */

function toggleLike() {

    if (!currentArtwork) return;


    const likes =
        JSON.parse(
            localStorage.getItem("shaynaLikes") || "{}"
        );


    likes[currentArtwork] =
        (likes[currentArtwork] || 0) + 1;


    localStorage.setItem(
        "shaynaLikes",
        JSON.stringify(likes)
    );


    updateLikes();

}


function updateLikes() {

    const likes =
        JSON.parse(
            localStorage.getItem("shaynaLikes") || "{}"
        );


    document.getElementById("like-count").textContent =
        likes[currentArtwork] || 0;

}


/* =========================================
   COMMENTS
========================================= */

function addComment() {

    const input =
        document.getElementById("comment-input");


    const text =
        input.value.trim();


    if (!text || !currentArtwork)
        return;


    const comments =
        JSON.parse(
            localStorage.getItem("shaynaComments") || "{}"
        );


    if (!comments[currentArtwork]) {
        comments[currentArtwork] = [];
    }


    comments[currentArtwork].push(text);


    localStorage.setItem(
        "shaynaComments",
        JSON.stringify(comments)
    );


    input.value = "";

    displayComments();

}


function displayComments() {

    const list =
        document.getElementById("comments-list");


    const comments =
        JSON.parse(
            localStorage.getItem("shaynaComments") || "{}"
        );


    list.innerHTML = "";


    const artworkComments =
        comments[currentArtwork] || [];


    artworkComments.forEach(comment => {

        const div =
            document.createElement("div");


        div.className = "comment";

        div.textContent = comment;


        list.appendChild(div);

    });

}


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeLightbox();

        }

    }
);


/* =========================================
   START GALLERY
========================================= */

displayGallery();