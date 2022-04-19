var $form = document.querySelector('form');
var $searchBar = document.querySelector('input');
var $recipeContainer = document.querySelector('.recipe-container');
var query = null;
var recipeId = null;
var recipe = null;

$form.addEventListener('submit', function (event) {
  event.preventDefault();

  if ($recipeContainer.firstElementChild) {
    while ($recipeContainer.hasChildNodes()) {
      $recipeContainer.children[0].remove();
    }
  }
  query = $searchBar.value;
  parseQuery();
  serverRequest();
  $form.reset();
});

$recipeContainer.addEventListener('click', function (event) {
  if (event.target.matches('button')) {
    recipeId = event.target.getAttribute('recipeid');
  }
  recipeRequest();
});

function parseQuery() {
  query = query.trim();
  query = query.replaceAll(' ', ',+');
}

function recipePreview(index) {
  var $recipePreviewEntry = document.createElement('div');
  $recipePreviewEntry.className = 'column-third margin-bot-fifteen recipe-preview-entry';

  var $recipePreviewCard = document.createElement('div');
  $recipePreviewCard.className = 'row flex-column align-center';

  var $recipeImage = document.createElement('img');
  $recipeImage.src = query[index].image;
  $recipeImage.className = 'recipe-img';

  var $recipeName = document.createElement('p');
  $recipeName.textContent = query[index].title;
  $recipeName.className = 'recipe-name';

  var $recipeInfoButton = document.createElement('button');
  $recipeInfoButton.className = 'info-button text-white';
  $recipeInfoButton.textContent = 'READ MORE';
  $recipeInfoButton.setAttribute('recipeid', query[index].id);

  $recipePreviewCard.append($recipeImage, $recipeName, $recipeInfoButton);
  $recipePreviewEntry.append($recipePreviewCard);
  $recipeContainer.append($recipePreviewEntry);
}

function serverRequest() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.spoonacular.com/recipes/findByIngredients' + '?ingredients=' + query + '&number=6&ranking=1&ignorePantry=true&apiKey=a264ae5f3ca9445d94cfeb08761ae88b');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    query = xhr.response;
    for (var queryIndex = 0; queryIndex < query.length; queryIndex++) {
      recipePreview(queryIndex);
    }
  });
  xhr.send();
}

function recipeRequest() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.spoonacular.com/recipes/' + recipeId + '/information?apiKey=a264ae5f3ca9445d94cfeb08761ae88b');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    recipe = xhr.response;
  });
  xhr.send();
}
