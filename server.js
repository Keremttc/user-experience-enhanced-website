// Importeer Express, een framework voor het bouwen van webservers
import express from 'express'

// Importeer de Liquid template-engine voor dynamische HTML-rendering
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express-app aan
const app = express()

const userId = 5

// Maak de map 'public' toegankelijk voor statische bestanden zoals CSS, JS en afbeeldingen
app.use(express.static('public'))

// Stel Liquid in als template-engine voor het renderen van HTML-pagina's
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Geeft aan waar de views (templates) zich bevinden
app.set('views', './views')

// GET route voor de homepage ('/') staat voor url domeinnaam
app.get('/', async function (request, response) {
  
   // Haal de stekjes-data op van de externe API (fetchen = ophalen)
   const stekjesResponse = await fetch('https://fdnd-agency.directus.app/items/bib_stekjes');

   // Zet de response om in JSON-formaat
   const stekjesResponseJSON = await stekjesResponse.json();
 
   const likedStekjes = await fetch('https://fdnd-agency.directus.app/items/bib_users_stekjes?filter=%7B"bib_users_id":5%7D');
   const likedstekjesResponseJSON = await likedStekjes.json();

  

   // Render de 'index.liquid' pagina en geef de opgehaalde data mee
   response.render('index.liquid', {
    // stekes empty state, onder
    stekjes: stekjesResponseJSON.data,
    likes: likedstekjesResponseJSON.data
   })
})

// GET route voor de detailpagina van een stekje ('/stekjes/:id')
// app.get('/stekjes', async function (request, response) {
//   // Haal het ID van het stekje uit de URL
//   const stekjeId = request.params.id;

//   // Doe een fetch-verzoek naar de API om de specifieke stekje-data op te halen
//   const stekjeResponse = await fetch(`https://fdnd-agency.directus.app/items/bib_stekjes/${stekjeId}`);
//   // Zet de response om in JSON-formaat
//   const stekjeData = await stekjeResponse.json();


  

// test
  app.get('/stekjes/:id', async function (request, response) {
    // Haal het ID van het stekje uit de URL
    const stekjeId = request.params.id;
  
    // Doe een fetch-verzoek naar de API om de specifieke stekje-data op te halen
    const stekjeResponse = await fetch(`https://fdnd-agency.directus.app/items/bib_users_stekjes?filter=%7B%22bib_users_id%22:5%7D`);
    // Zet de response om in JSON-formaat
    const stekjeData = await stekjeResponse.json();




  
  // Render de 'stekjes.liquid' pagina en geef de opgehaalde stekje-data mee
  response.render('stekjes.liquid', { stekje: stekjeData.data})
});

// POST route voor het verwerken van formulieren op de homepage ('/')
app.post('/stekjes/:id', async function (request, response) {
  const stekjeId = request.params.id;
    // Log de ontvangen aanvraag in de console (handig voor debugging)
    // console.log('Verzoek ontvangen:', request.body);
    // check eerst in bib_users_stekjes of dit stekjeID en deze userID al bestaan
    const userstekjeEntry = await fetch(`https://fdnd-agency.directus.app/items/bib_users_stekjes?filter={"bib_stekjes_id":${stekjeId},"bib_users_id":${userId}}`)
    const userstekjeEntryJSON = await userstekjeEntry.json()

    console.log(request.params.id)
    if (userstekjeEntryJSON.data.length != 0) {
      // Delete de boel uit Directus
      await fetch(`https://fdnd-agency.directus.app/items/bib_users_stekjes/${userstekjeEntryJSON.data[0].id}`, {
        method: 'DELETE'
      });
    } else {
      // Stuur een POST-verzoek naar de API om een nieuw bericht op te slaan
      const directusResponse = await fetch('https://fdnd-agency.directus.app/items/bib_users_stekjes', {
        method: 'POST',
        body: JSON.stringify({
          bib_stekjes_id: stekjeId, // Koppel het bericht aan het juiste stekje
          bib_users_id: 5, // ID van de gebruiker (dit kan dynamisch worden)
        }),
        headers: {
          'Content-Type': 'application/json' // Geef aan dat de data JSON is
        }
      });

    }
    // Log de status van de API-response in de console
    //console.log('Directus API antwoord:', directusResponse.status);
    
    // Stuur de gebruiker terug naar de homepage na een succesvolle aanvraag
    response.redirect(303, '/');

});
// WHOIS API
const API_BASE_URL = "https://fdnd-agency.directus.app/items";

// GET route voor het ophalen van één specifiek stekje op basis van een ID
app.get("/stekje/:id", async function (request, response) {
  // Haal een specifiek stekje op vanuit de WHOIS API door een fetch-verzoek te sturen naar de eindpoint `/bib_stekjes/{id}`
  // Het ID wordt uit de URL gehaald via `request.params.id`
  const stekjesResponse = await fetch(
    `${API_BASE_URL}/bib_stekjes/${request.params.id}?fields=*,foto.id,foto.width,foto.height`
  );

  // Zet het response-object om naar JSON-formaat, zodat we de data kunnen gebruiken
  const stekjesResponseResponseJSON = await stekjesResponse.json();

  console.log(stekjesResponseResponseJSON)

  // Render de `stekjesDetail.liquid` template uit de views-map
  // Geef de opgehaalde data mee als een variabele genaamd `stekje`, zodat deze in de template gebruikt kan worden
  response.render("stekjeDetail.liquid", {
    stekje: stekjesResponseResponseJSON.data,
  });
});


// // Middleware voor 404-fout (pagina niet gevonden)
// app.use((req, res, next) => {
//   res.status(404).send("Error! Pagina niet gevonden.");
// })

// Stel het poortnummer in waar Express op moet luisteren (standaard: 8006)
app.set('port', process.env.PORT || 8006)

// Start de server en laat een bericht zien in de console
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})


