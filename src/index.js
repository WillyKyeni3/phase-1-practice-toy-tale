let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // fetch all toys and render them
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToyCard(toy));
    })
    .catch(error => {
      console.error('Error fetching toys:', error);
    });

  // Handle form submission
  const form = document.querySelector('.add-toy-form');
  form.addEventListener('submit', handleFormSubmit);

  // Function to render a toy card
  function renderToyCard(toy) {
    const collection = document.getElementById('toy-collection');

    const card = document.createElement('div');
    card.className = 'card';

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;

    const img = document.createElement('img');
    img.src = toy.image;
    img.className = 'toy-avatar';

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement('button');
    button.className = 'like-btn';
    button.id = toy.id;
    button.textContent = 'Like ❤️';

    // Like button event handler
    button.addEventListener('click', () => {
      const toyId = parseInt(button.id);
      let currentLikes = parseInt(p.textContent);
      currentLikes += 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ likes: currentLikes })
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update likes');
        return response.json();
      })
      .then(updatedToy => {
        p.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => {
        console.error('Error updating likes:', error);
      });
    });

    // Append all elements to card
    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    // Add card to collection
    collection.appendChild(card);
  }

  // Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();

    const name = event.target.name.value.trim();
    const image = event.target.image.value.trim();

    if (!name || !image) {
      alert('Please fill out both fields.');
      return;
    }

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ name, image, likes: 0 })
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to create toy');
      return response.json();
    })
    .then(newToy => {
      renderToyCard(newToy);
    })
    .catch(error => {
      console.error('Error creating toy:', error);
    });

    // Clear form inputs
    event.target.name.value = '';
    event.target.image.value = '';
  }
});


