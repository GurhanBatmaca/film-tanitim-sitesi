const movieContainer = document.querySelector("#movie-container");
const paginationContainer = document.querySelector("#pagination-container");
const footerTime = document.querySelector("#copyright span");
const errorsContainer = document.querySelector("#errors-container");
let movieOriginalTitle,movieTitle,konu,gosterimTarihi,poster,puan,id,actImg,moviePoster,detailPoster,actMultiName,allActMovies,allActOverview,allPoster,allVote,allDate
let mainPage = 1;
let mainUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=tr&page=`;

document.querySelector("#get-vizyon-btn").addEventListener("click", () => {
    getVizyonFilmler();
});

document.querySelector("#get-populer-btn").addEventListener("click", () => {
    getPopulerFilmler();
});

document.querySelector("#get-cok-oylanan-btn").addEventListener("click", () => {
    getFazlaOyAlanFilmler();
});

document.querySelector("#get-yakinda-btn").addEventListener("click", () => {
    yakindaCikacakFilmler();
});

const moviePage = async (sayfa) => {
    movieContainer.innerHTML ="";
    paginationContainer.innerHTML ="";

    try {
        const page = await fetch(`${mainUrl}${sayfa}`);
        const request = await page.json();

        let pageNo = request.page;
        let totalPages = request.total_pages;
        // düzenle
        if(totalPages == 0) {
            throw new Error("Film adını doğru yazdığınızdan emin olun! Anasayfaya yönlendiriliyorsunuz.");
        };
        let results = request.results;

        // filmlerin gösterildiği kısım
        let moviesDis = `
            <div id="movies" class="row row-cols-1 row-cols-md-3 g-4">
                
            </div>
        `;
        movieContainer.insertAdjacentHTML("beforeend", moviesDis);
        let movies = document.querySelector("#movies");
        

        results.forEach((element) => {
            movieOriginalTitle = element.original_title;
            movieTitle = element.title;
            konu = element.overview;
            gosterimTarihi = element.release_date;
            poster = element.poster_path;
            puan = element.vote_average;
            id = element.id;
            if(poster == null) {
                moviePoster = "img/puzzle.jpg";
            }
            else {
                moviePoster = `https://image.tmdb.org/t/p/w780${poster}`
            }
   
            let html = `
                <div class="col movie-col">
                    <div class="card mavie-card" onclick="showId(${id})">
                        <img src="${moviePoster}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title film-isim">${movieTitle}</h5>
                            <h5 class="card-title puanlama">TMDB Puanı: ${puan}</h5>
                            <p class="card-text"><small class="text-muted">
                            Gösterim Tarihi: ${gosterimTarihi}
                            </small></p>
                            <p class="card-text movie-konu line-clamp">${konu}</p>
                            <p class="card-text movie-konu line-clamp">Devamı...</p>
                        </div>
                    </div>
                </div>
            `;
    
            movies.insertAdjacentHTML("beforeend", html);   
            
        });

        
        let pagesDis = `
            <div id="pages" class="d-flex justify-content-center mb-3 py-3" role="group" aria-label="Basic example">
                <button id="btn-prev" type="button" class="btn "><i class="fa-solid fa-circle-arrow-left fa-2x"></i></button>
                <button id="btn-next" type="button" class="btn"><i class="fa-solid fa-circle-arrow-right fa-2x"></i></button>
            </div>
        `;
        paginationContainer.insertAdjacentHTML("beforeend", pagesDis);

        let btnPrev = document.querySelector("#btn-prev");
        let btnNext = document.querySelector("#btn-next");

        btnNext.addEventListener("click", () => {
            movieContainer.innerHTML = "";
            tanitimContainer.innerHTML = "";
            paginationContainer.innerHTML = "";
            nextPage();
        });
        btnPrev.addEventListener("click", () => {
            movieContainer.innerHTML = "";
            tanitimContainer.innerHTML = "";
            paginationContainer.innerHTML = "";
            prevPage();
        });

        if(pageNo <= 1 ) {
            btnPrev.classList.add("pasif-page")
        } else {
            btnPrev.classList.remove("pasif-page")
        }
        if (totalPages == pageNo) {
            btnNext.classList.add("pasif-page")
        } else {
            btnNext.classList.remove("pasif-page")
        }
        
        // console.log(mainPage);
        // console.log(mainUrl);
    }
    catch(err) {
        console.log(err);
        let errorsDis = `
        <div class="alert alert-danger" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
            ${err.message}
        </div>
        `;
        errorsContainer.insertAdjacentHTML("beforeend",errorsDis);
        mainUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=tr&page=`;
        setTimeout(moviePage,4000);
        setTimeout(clearErrorMessage,4000);
    }

}

const clearErrorMessage = () => {
    errorsContainer.innerHTML = "";
}

moviePage(mainPage);

const showId = (id) => {
    // console.log(id);
    movieDetails(id);
};

const nextPage = () => {
    mainPage++
    moviePage(mainPage);
};

const prevPage = () => {
    mainPage--;
    moviePage(mainPage);
};

const movieDetails = async (movieId) => {
    try {
        let url = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=tr`);
        let data = await url.json();
        // console.log("aaaa" + movieId);

        let poster = data.backdrop_path;
        if(poster == null) {
            detailPoster = "img/puzzle.jpg";
        }
        else {
            detailPoster = `https://image.tmdb.org/t/p/w1280${poster}`;
        }
        let genres = data.genres;
        let turListe = [];
        for(let g of genres) {
            turListe.push(g.name);
        };
        let name = data.title;
        let konu = data.overview;
        let puan = data.vote_average;
        let slogan = data.tagline;

        movieContainer.innerHTML = "";
        paginationContainer.innerHTML = "";

        let movieDis = `
            <div id="movieDetail">
                <div id="detail-header" class=" mb-3 d-flex justify-content-between align-items-center">   
                    <h5 id="datail-title">${name}</h5>
                    <h5 id="datail-vote">${puan.toFixed(1)}</h5>
                </div>
                <div id="detail-img" class="mb-3">   
                    <img src="${detailPoster}">
                </div>
                <div id="datail-body class="text-center mb-3"">
                    <p id="detail-tur" class="mb-3">${turListe}</p>
                    <p id="detail-overview" class="text-center mb-3">${konu}</p>
                    <p id="detail-slogan" class="text-center mb-3">${slogan}</p>
                </div>
                <div id="detail-cast" class="row">  

                </div>
                <div id="details-back" class="text-center">
                    <button id="datail-back-btn" type="button" class="btn">Geri dön<i class="fa-solid fa-reply-all"></i></button>
                </div>
            </div>
        `;

        movieContainer.insertAdjacentHTML("beforeend",movieDis)       
        // console.log(data);

        let btnDetailsBack = document.querySelector("#datail-back-btn");

        btnDetailsBack.addEventListener("click", () => {
            movieContainer.innerHTML = "";
            // console.log(mainUrl);   ilk gelinen sayfanın adresi
            moviePage(mainPage);
        });

        try {
            let castUrl = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=en-US`);
            let castData = await castUrl.json();
            let castList = castData.cast;
            let revizeList = [];
            for(let e=0; e < castList.length;e++) {
                if(e < 18) {
                    revizeList.push(castList[e]);
                };
            };

            revizeList.forEach((ele) => {
                let character = ele.character;
                let actName = ele.name;
                let actProfilImg = ele.profile_path;
                if(actProfilImg == null) {
                    actProfilImg = "img/puzzle.jpg";
                    actImg = actProfilImg;                   
                }
                else {
                    actImg = `https://image.tmdb.org/t/p/w185${actProfilImg}`;
                }

                let detailCast = document.querySelector("#detail-cast");
                let detailCastDis = `
                    <div class="col-lg-2 col-md-3 col-sm-4 p-4 detail-cast-card">
                        <div id="cast-card" class="card cast-card">
                            <img class="cast-img" src="${actImg}" class="card-img-top" alt="...">
                            <div class="card-body">
                            <p class="card-text cast-name">Karakter: ${character}</p>
                            <p class="card-text cast-caracter">Oyuncu: ${actName}</p>
                            </div>
                        </div>
                    </div>
                `;
                detailCast.insertAdjacentHTML("beforeend",detailCastDis);

            })

            document.querySelectorAll(".detail-cast-card").forEach((elements) => {
                elements.addEventListener("click", () => {
                    actMultiName = elements.querySelector(".cast-caracter").textContent.slice(8).split(" ").join("%20");
                    getActDetails(actMultiName);
                })
            })


            
        }
        catch(errs) {
            console.log(errs)
        }

        }
        catch(err) {
            console.log(err);
        }
};

const getVizyonFilmler = () => {
    movieContainer.innerHTML = "";
    mainUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=tr&page=`;
    moviePage(mainPage);
};

const getPopulerFilmler = () => {
    movieContainer.innerHTML = "";
    mainUrl = `https://api.themoviedb.org/3/movie/popular?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=tr&page=`;
    moviePage(mainPage);
};

const getFazlaOyAlanFilmler = () => {
    movieContainer.innerHTML = "";
    mainUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=tr&page=`;
    moviePage(mainPage);
};

const yakindaCikacakFilmler = () => {
    movieContainer.innerHTML = "";
    mainUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=tr&page=`;
    moviePage(mainPage);
};

const searchMovie = (movieName) => {
    mainUrl = `https://api.themoviedb.org/3/search/movie?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=tr&query=${movieName}&page=`;
    moviePage(mainPage);
};

const getActDetails = async (multiName) => {
    
    let actUrl = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=ad9a7b0c1f07914b7f151c86d435af36&language=tr&query=${multiName}&page=1&include_adult=false`);
    let castShow = await actUrl.json();
    let actResults = castShow.results;
    // console.log(castShow);
    // console.log(actResults);
    movieContainer.innerHTML = "";
    let disActElement = `
        <div class="row disActElement">
        </div>
    `;
    movieContainer.insertAdjacentHTML("beforeend",disActElement);
    let atcDis = document.querySelector(".disActElement");

    actResults.forEach((elem) => {
        if(elem.known_for) {
            for(let u of elem.known_for) {
                console.log(u);
                if(u.title) {
                    allActMovies = u.title; 
                }
                else {
                    allActMovies = u.original_name
                }
                if(u.overview) {
                    allActOverview = u.overview;
                }
                else {
                    allActOverview = "Konu bulunamadı.";
                }
                if(u.poster_path) {
                    allPoster = `http://image.tmdb.org/t/p/w780/${u.poster_path}`;
                }
                else {
                    allPoster = "img/puzzle.jpg";
                }
                allVote = u.vote_average;
                allDate = u.release_date;   
                

                
                let allDis = `
                <div class="allMovies col-md-6">
                    <div id="detail-header" class=" mb-3 d-flex justify-content-between align-items-center">   
                        <h5 id="datail-title">${allActMovies}</h5>
                        <h5 id="datail-vote">${allVote}</h5>
                    </div>
                    <div id="detail-img" class="mb-3">   
                        <img src="${allPoster}">
                    </div>
                    <div id="datail-body class="text-center mb-3"">
                        <p id="detail-overview" class="text-center mb-3 detail-overview">${allActOverview}</p>
                        <p id="detail-slogan" class="text-center mb-3">Gösterim Tarihi: ${allDate}</p>
                    </div>
            `;
    
            atcDis.insertAdjacentHTML("beforeend",allDis);  
            }

        }
       
    });

    let anaSayfaDon = `
        <div class="text-center  anaSayfaDon">
            <button type="button" class="btn">
                Ana Sayfaya Dön <i class="fa-solid fa-reply-all"></i>
            </button>
        </div>
    `;
    atcDis.insertAdjacentHTML("beforeend",anaSayfaDon);

    let anaSayfaDonBtn = document.querySelector(".anaSayfaDon button");

    anaSayfaDonBtn.addEventListener("click", ()=> {
        moviePage(mainPage);
    });
};


footerTime.innerHTML= new Date().getFullYear();




// detail-cast sayfasına cast ekle!




