document.addEventListener('DOMContentLoaded', Populatepage);

function Populatepage() {
  fetch(`http://localhost:3000/quotes?_embed=likes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then(response => response.json())
    .then(data => Datainputs(data))
    .catch(error => {
      // Handle any errors
      console.error(error);
    });
}

function quotes(data) {
  let userList = document.querySelector('#quote-list');
  let listItem = document.createElement('li');
  listItem.classList.add('quote-card');

  listItem.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${data.quote}</p>
      <footer class="blockquote-footer">${data.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span id ='increase' >0</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  `;

  userList.appendChild(listItem);
  let increaseLike = listItem.querySelector('#increase');
  let likeButton = listItem.querySelector('.btn-success');
  let quoteId = data.id;


  likeButton.addEventListener('click', function(event) {
    event.preventDefault();
    const likeData = {
      quoteId: quoteId
    };

    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(likeData)
    })
      .then(res => res.json())
      .then(like => {
        increaseLike.textContent = like.quoteId;
      })
      .catch(error => {
        console.error(error);
      });
  });

  let deleteButtons = document.getElementsByClassName('btn-danger');
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', function(event) {
      event.preventDefault();
      listItem.remove();
      let quoteId = data.id; // Assuming you have a unique ID for each quote

      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(res => res.json())
        .catch(error => {
          console.error(error);
        });
    });
  }
}

function Datainputs(data) {
  data.forEach(data => quotes(data));
}

let form = document.getElementById('new-quote-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  let inputQuote = document.getElementById('new-quote').value;
  let inputAuthor = document.getElementById('author').value;
  let obj = {
    quote: inputQuote,
    author: inputAuthor
  };
  fetch('http://localhost:3000/quotes?_embed=likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(obj)
  })
    .then(res => res.json())
    .then(data => Datainputs(data))
    .catch(error => {
      console.error(error);
    });

  form.reset();
});
