    import express, { application } from 'express'
    import { Liquid } from 'liquidjs'

    const app = express()
    app.use(express.urlencoded({ extended: true}))
    app.use(express.static('public'))


    const engine = new Liquid()
    app.engine('liquid', engine.express())
    app.set('views', './views')

    app.get('/', ( req, res) => {
    res.render('index.liquid')
    })


    app.get('/contact', ( req, res) => {
        res.render('contact.liquid')
    })

    app.get('/about', ( req, res) => {
        res.render('about.liquid')
    })


    app.get('/blog', ( req, res) => {
        
        res.render('blog.liquid')
    })   

    app.post('/blog', (req, res) => {

        res.redirect('/blog')
    })

    
    app.get('/project', ( req, res) => {
        res.render('project.liquid')
    })   


    app.set('port', process.env.PORT || 8000)

    // Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
    app.listen(app.get('port'), function () {
    // Toon een bericht in de console
    console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
    })