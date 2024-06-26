const dataBody = document.getElementById("mbody");
const app = document.getElementById("app");

const t = document.querySelector("#hamburger"),
  n = document.querySelector(".menu");
t.addEventListener("click", function () {
  this.classList.toggle("active"), n.classList.toggle("hide");
});

function searchFunction0() {
  var searchValue0 = document.getElementById("search0");
  localStorage.setItem("search", searchValue0.value);
  location.reload();
}

function loadjs() {
  const dataType = localStorage.getItem("openType");
  if (dataType == "anime") {
    openAnime();
  } else if (dataType == "home") {
    openHome();
  } else if (dataType == "search") {
    openSearch();
  } else if (dataType == "setting") {
    openSetting2();
  } else {
    openHome();
  }
}

function openHome() {
  if (!document.querySelector(".main-home")) {
    var app2 = document.querySelector(".htmlCon #app");
    localStorage.setItem("openType", "home");
    if (app2) {
      app2.remove();
    }
    includeHTML("include-home");
    eel.EopenHome();
  }
}

function openHome2() {
  if (!document.querySelector(".main-home")) {
    localStorage.setItem("openType", "home");
    location.reload();
  }
}

function openSearch(value) {
  if (!document.querySelector(".main-search")) {
    var app3 = document.querySelector(".htmlCon #app");
    localStorage.setItem("openType", "search");
    if (app3) {
      app3.remove();
    }
    includeHTML("include-search");
    if (value) {
      eel.EopenSearch(value);
    } else {
      eel.EopenSearch(localStorage.getItem("search"));
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        var searchValue0 = document.getElementById("search0");
        if (searchValue0 && searchValue0.value != "") {
          searchFunction0();
        }
      }
    });
  }
}

function openSearch2(keyword) {
  if (!document.querySelector(".main-search")) {
    localStorage.setItem("openType", "search");
    if (keyword) {
      localStorage.setItem("search", keyword);
    }
    location.reload();
  }
}

function openAnime(url) {
  if (!document.querySelector(".main-anime")) {
    var app2 = document.querySelector(".htmlCon #app");
    localStorage.setItem("openType", "anime");
    if (app2) {
      app2.remove();
    }
    includeHTML("include-anime");
    if (url) {
      localStorage.setItem("lastAnime", url);
      eel.EopenAnime(url);
    } else {
      eel.EopenAnime(localStorage.getItem("lastAnime"));
    }
  }
}

function openAnime2(url) {
  if (url) {
    localStorage.setItem("lastAnime", url);
  }
  localStorage.setItem("openType", "anime");
  location.reload();
}

function openSetting2() {
  if (!document.querySelector(".main-setting")) {
    var app2 = document.querySelector(".htmlCon #app");
    localStorage.setItem("openType", "setting");
    if (app2) {
      app2.remove();
    }
    includeHTML("include-setting");
    //eel.EopenHome();
  }
}

function openSetting() {
  if (!document.querySelector(".main-setting")) {
    localStorage.setItem("openType", "setting");
    location.reload();
  }
}

function searchFunction() {
  var searchValue = document.getElementById("search");
  localStorage.setItem("search", searchValue.value);
  openSearch2(searchValue.value);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    var searchValue = document.getElementById("search");
    if (searchValue && searchValue.value != "") {
      searchFunction();
    }
    var searchValue0 = document.getElementById("search0");
    if (searchValue0 && searchValue0.value != "") {
      searchFunction0();
    }
  }
});

eel.expose(close_window);
function close_window() {
  window.close();
}

eel.expose(showErr);
function showErr(errCode, type) {
  console.error("error" + errCode, type);
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
    color: "var(--text)",
    background: "var(--primary16)",
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonColor: "var(--primary)",
    focusConfirm: false,
  }).then((result) => {
    if (result.isConfirmed && type == "i") {
      openHome2();
    }
  });
}

function toSub() {
  var shorturl = localStorage.getItem("shorturl");
  var epnumber = localStorage.getItem("epnumber");
  var toSubUrl = shorturl + "-episode-" + epnumber;
  localStorage.setItem("lastAnime", toSubUrl);
  var activeLng = document.querySelectorAll(".episode-element.language.active");
  activeLng.forEach(function (e) {
    e.classList.remove("active");
  });
  document.getElementById("toSub").classList.add("active");
  eel.loadAnime(toSubUrl);
}

function toDub() {
  var shorturl = localStorage.getItem("shorturl");
  var epnumber = localStorage.getItem("epnumber");
  var toDubUrl = shorturl + "-dub-episode-" + epnumber;
  localStorage.setItem("lastAnime", toDubUrl);
  var activeLng = document.querySelectorAll(".episode-element.language.active");
  activeLng.forEach(function (e) {
    e.classList.remove("active");
  });
  document.getElementById("toDub").classList.add("active");
  eel.loadAnime(toDubUrl);
}

function openEpisode(epnum) {
  var activeEp = document.querySelectorAll(".episode-element.ep.active");
  if (activeEp) {
    activeEp.forEach(function (e) {
      e.classList.remove("active");
    });
  }
  var episodeEle = document.getElementById("ep" + epnum);
  if (episodeEle) {
    episodeEle.classList.add("active");
  }
  var epstr = localStorage.getItem("lastAnime");
  var epresult = epstr.replace(/(episode-).*/, "$1");
  var toEpUrl = epresult + epnum;
  localStorage.setItem("lastAnime", toEpUrl);
  eel.loadAnime(toEpUrl);
}

function addEpisode(length) {
  const totalEp = length;

  const EpPerPage = 100;
  const episodeCon = document.getElementById("episodeCon");
  const pagination = document.getElementById("arEp");

  function createDivs(startIndex, endIndex) {
    episodeCon.innerHTML = "";
    for (let i = startIndex; i <= endIndex && i <= totalEp; i++) {
      const div = document.createElement("button");
      div.setAttribute("id", `ep${i}`);
      div.setAttribute("onclick", `openEpisode(${i})`);
      div.setAttribute("class", "episode-element ep");
      div.innerText = i;
      episodeCon.appendChild(div);
    }
  }

  function createPaginationButtons() {
    const totalPages = Math.ceil(totalEp / EpPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("a");
      const start = (i - 1) * EpPerPage + 1;
      const end = i * EpPerPage;
      if (end > totalEp) {
        button.innerText = `${start}-${totalEp}`;
      } else {
        button.innerText = `${start}-${end}`;
      }
      button.onclick = () => createDivs(start, end);

      pagination.appendChild(button);
    }
  }

  // Initialize
  createPaginationButtons();
  createDivs(1, EpPerPage);
}

eel.expose(animeList);
function animeList(type, title, episode, url, image) {
  if (type == "r") {
    var aniCon1 = document.getElementById("aniCon1");
    aniCon1.innerHTML += `
        <div class="item">
            <div class="ani poster">
              <a onclick="openAnime2('${url}')">
                <img
                  src="${image}"
                  alt="${title}"
                />
              </a>
            </div>
            <div class="meta">
              <div class="inner">
                <div class="left">
                  <span class="ep-status total">${episode}</span>
                </div>
                <div class="right"></div>
              </div>
            </div>
            <div class="info">
              <a class="name" onclick="openAnime2('${url}')">${title}</a>
            </div>
          </div>
        `;
  }
}

eel.expose(animeList2);
function animeList2(type, title, keyword, url, image) {
  var aniCon2 = document.getElementById("aniCon2");
  var sloader = document.querySelector(".sLoader");
  if (type == "f") {
    if (sloader) {
      sloader.innerHTML = `<h1>There is no anime<h1>`;
    }
  } else {
    if (sloader) {
      sloader.remove();
    }
    if (aniCon2) {
      aniCon2.innerHTML += `
      <div class="item">
        <div class="ani poster">
          <a onclick="openAnime2('${url + "-episode-1"}')">
            <img
              src="${image}"
              alt="${title}"
            />
          </a>
        </div>
        <div class="info">
          <a class="name" onclick="openAnime2('${url}')">${title}</a>
        </div>
      </div>
    `;
    }
    const Skeyword = document.getElementById("Skeyword");
    if (!Skeyword.innerHTML) {
      Skeyword.innerHTML = `Search results for:  ${keyword}`;
      var searchValue0 = document.getElementById("search0");
      searchValue0.value = keyword;
    }
  }
}
eel.expose(anime);
function anime(title, iframe, language, episode_number, link, langCode) {
  var toDub = document.getElementById("toDub");
  var totalEp = localStorage.getItem("totalEpCC");
  if (langCode != "200") {
    toDub.disabled = true;
  } else {
    toDub.disabled = false;
  }
  localStorage.setItem("fullurl", link);
  localStorage.setItem("epnumber", episode_number);
  document.getElementById("crEp").innerHTML = episode_number;
  document.getElementById("title").innerHTML = title;
  document.querySelector(".loader").style.display = "none";
  document.getElementById("anime").innerHTML += iframe;
  if (language == "dub") {
    document.getElementById("toDub").classList.add("active");
  } else if (language == "sub") {
    document.getElementById("toSub").classList.add("active");
  }
  var episodeId = "ep" + episode_number;
  document.getElementById(episodeId).classList.add("active");

  if (totalEp == episode_number) {
    document.getElementById("nextEp").disabled = true;
    document.getElementById("nextEp2").disabled = true;
  } else {
    document.getElementById("nextEp").disabled = false;
    document.getElementById("nextEp2").disabled = false;
  }
  if (episode_number == 1) {
    document.getElementById("preEp").disabled = true;
    document.getElementById("preEp2").disabled = true;
  } else {
    document.getElementById("preEp").disabled = false;
    document.getElementById("preEp2").disabled = false;
  }
}

eel.expose(animeDes);
function animeDes(
  image,
  animeTitle,
  animeDes,
  animeEpisode,
  animeType,
  animeGerne,
  arEpisode,
  shortUrl,
  dubEpisode
) {
  document.getElementById("animeImage").src = image;
  document.getElementById("animeTitle").innerHTML = animeTitle;
  document.getElementById("animeDes").innerHTML = animeDes;
  document.getElementById("animeEpisode").innerHTML = animeEpisode;
  document.getElementById("ccEps").innerText = animeEpisode;
  document.getElementById("dubEps").innerText = dubEpisode;
  if (dubEpisode == "0") {
    document.getElementById("toDub").hidden = true;
  }
  document.getElementById("animeType").innerHTML = animeType;
  document.getElementById("animeGerne").innerHTML = animeGerne;
  const animeGerne2 = document.querySelectorAll("#animeGerne a");
  for (let i = 0; i < animeGerne2.length; i++) {
    animeGerne2[i].removeAttribute("href");
  }
  const nodeList = document.querySelectorAll(".extra");
  for (let i = 0; i < nodeList.length; i++) {
    nodeList[i].style.visibility = "visible";
  }
  localStorage.setItem("shorturl", shortUrl);
  localStorage.setItem("animeTep", animeEpisode);
  addEpisode(animeEpisode);
  localStorage.setItem("totalEpCC", animeEpisode);
  localStorage.setItem("totalEpDub", dubEpisode);
}

function nextEp() {
  var episode_number = Number(localStorage.getItem("epnumber"));
  var totalEp = Number(localStorage.getItem("totalEpCC"));
  var nextEp = episode_number + 1;
  if (totalEp != episode_number) {
    openEpisode(nextEp);
  }
}

function preEp() {
  var episode_number = Number(localStorage.getItem("epnumber"));
  var preEp = episode_number - 1;
  if (episode_number != 1) {
    openEpisode(preEp);
  }
}

loadjs();
