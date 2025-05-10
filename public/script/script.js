


// Hamburger menu toggle
document.querySelector('.hamburger')?.addEventListener('click', () => {
  document.querySelector('.nav')?.classList.toggle('active');
});

// Formulier submit handler met event delegation
document.addEventListener('submit', async function (event) {
  const form = event.target;

  // Check of formulier data-enhanced is
  if (!form.hasAttribute('data-enhanced')) return;

  event.preventDefault(); // Voorkom standaard gedrag

  // Activeer loading state op like-button
  const likeButton = form.querySelector('.like-button');
  likeButton?.classList.add('loading');

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new URLSearchParams(new FormData(form)),
    });

    const responseText = await response.text();
    const parser = new DOMParser();
    const responseDOM = parser.parseFromString(responseText, 'text/html');

    // Zoek de nieuwe HTML op basis van data-enhanced attribuut
    const newState = responseDOM.querySelector(
      `[data-enhanced="${form.getAttribute('data-enhanced')}"]`
    );

    // Sla een referentie op naar de huidige positie in de DOM
    form.replaceWith(newState);

    // Zoek de nieuwe like-button
    const nieuweLikeButton = newState.querySelector('.like-button');

    if (nieuweLikeButton) {
      nieuweLikeButton.classList.add('liked');

      setTimeout(() => {
        nieuweLikeButton.classList.remove('liked');
      }, 600);
    }

    // ✅ Laat een succesmelding zien
    showSuccesMelding('Stekje geliked!');
  } catch (error) {
    console.error('Fout bij liken:', error);
    showFoutMelding('Er ging iets mis. Probeer het later opnieuw.');
  }
});

// ✅ Functie om een succesmelding te tonen
function showSuccesMelding(tekst) {
  const melding = document.createElement('div');
  melding.textContent = tekst;
  melding.classList.add('melding', 'succes-melding');
  melding.setAttribute('role', 'status');
  melding.setAttribute('aria-live', 'polite');

  document.body.appendChild(melding);

  setTimeout(() => {
    melding.remove();
  }, 2000);
}

// ❌ Functie om een foutmelding te tonen
function showFoutMelding(tekst) {
  const melding = document.createElement('div');
  melding.textContent = tekst;
  melding.classList.add('melding', 'fout-melding');
  melding.setAttribute('role', 'alert');
  melding.setAttribute('aria-live', 'assertive');

  document.body.appendChild(melding);

  setTimeout(() => {
    melding.remove();
  }, 3000);
}
