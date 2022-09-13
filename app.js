var data = [];
let searchInput = document.querySelector("Input");
let suggestions = document.getElementById("sugesstion");

function getData(url, fn) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        fn(undefined, JSON.parse(xhr.responseText));
      } else {
        fn(new Error(xhr.statusText), undefined);
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

searchInput.addEventListener("keyup", function () {
  console.log(searchInput.value);
  suggestions.innerHTML = "";
  getData(
    `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=10&format=json&search=${searchInput.value}`,
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        let suggestion = res[1].filter(function (name) {
          // console.log(name, searchInput.value);
          return name.toLowerCase().startsWith(searchInput.value);
        });
        suggestion.forEach((suggested) => {
          getData(
            `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageprops|pageimages&format=json&titles=${suggested}`,
            function (err1, res1) {
              if (err1) {
                console.log(err1);
              } else {
                console.log(res1);
                // let thumbnail = Object.values(res.query.pages);
                // console.log(thumbnail);
                let x = Object.keys(res1.query.pages);
                let linkimg = res1.query.pages[x].thumbnail.source;
                let linkdes =
                  res1.query.pages[x].pageprops["wikibase-shortdesc"];
                // let linkdes = res.query.pages[x].pageprops.wikibase - shortdesc;
                suggestions.innerHTML += `<li>
                <div class="thumbnail">
                  <img src="${linkimg}" alt="" />
                </div>
                <div class="text">
                  <div class="suggested">${suggested}</div>
                  <div class="description"><a style="text-decoration:none;color:#ACACAE;"href="https://en.wikipedia.org/wiki/${suggested}">${linkdes}</a></div>
                </div>
              </li>`;
              }
            }
          );
        });
      }
    }
  );
});
