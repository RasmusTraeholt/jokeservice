const jokeContainer = document.getElementById('jokes');
const btnPost = document.getElementById('btnPost');
const serviceContainer = document.getElementById('services');
const newJokeContainer = document.getElementById('newJoke');
const btnDeleteService = document.getElementById('btnDeleteService');
const btnCreateService = document.getElementById('btnCreateService');
const maxJokes = 50;

update();

//createService();

async function update() {
    jokeContainer.innerHTML = '';
    serviceContainer.innerHTML = '';
    for (let input of document.querySelectorAll('input')) input.value = '';
    getServices();
}

function updateJokes() {
    jokeContainer.innerHTML = '';
    for (let input of document.querySelectorAll('input')) input.value = '';
    if (serviceContainer.value != '0') {
        getJokes(serviceContainer.value);
    }
}

async function getJokes(id) {
    jokeContainer.innerHTML = 'Loading...';
    let template;
    let response;
 
    if (!id || serviceContainer.options[serviceContainer.selectedIndex].id === 'https://jokeservice69.herokuapp.com/') {
        response = await fetch('/api/jokes');
        template = await fetch('/joke.hbs');
    } else {
        response = await fetch('/api/otherjokes/' + id);
        template = await fetch('/joke.hbs');
    }

    console.log(response);

    try {
        const templateText = await template.text();
        const jokes = await response.json();

        console.log(jokes);

        const compiledTemplate = Handlebars.compile(templateText);

        console.log(jokes.length);

        let jokesHTML = '';

        jokes.forEach(joke => {
            jokesHTML += compiledTemplate({
                id: joke._id,
                setup: joke.setup,
                punchline: joke.punchline,
            });
        });
        jokeContainer.innerHTML = jokesHTML;
    } catch (err) {
        console.log(err);
        jokeContainer.innerHTML = 'Failed to fetch jokes from: <a href="' + serviceContainer.options[serviceContainer.selectedIndex].id + '">' + serviceContainer.options[serviceContainer.selectedIndex].id +'</a>';
    }
}

async function getServices() {
    const [template, response] = await Promise.all([fetch('/service.hbs'), fetch('/api/othersites')]);
    const [templateText, services] = await Promise.all([template.text(), response.json()]);

    const compiledTemplate = Handlebars.compile(templateText);
    let HTML = '<option value="0" disabled selected>Select a site</option>';
    services.forEach(service => {
        HTML += compiledTemplate({
            id: service._id,
            name: service.name,
            address: service.address,
            secret: service.secret
        });
    });
    serviceContainer.innerHTML = HTML;
}

async function deleteJoke(id) {
    let url = serviceContainer.options[serviceContainer.selectedIndex].id;
    const data = {address: url, id: id};
    try {
        const response = await fetch('/api/othersite/jokes/' + id, {
            method: 'DELETE',
            body: JSON.stringify({address: url}),
            headers: {'Content-Type': 'application/json'}
        })
        const json = await response.json();
        console.log(`Resultat: %o`, json);
        updateJokes();
    } catch (err) {
        console.log(err);
    }
}

async function editJoke(id) {
    const url = serviceContainer.options[serviceContainer.selectedIndex].id;
    const setup = document.getElementById('setup-' + id).innerText;
    const punchline = document.getElementById('punchline-' + id).innerText;
    if (setup.length > 0 && punchline.length > 0) {
        const msg = {
            url: url,
            setup: setup,
            punchline: punchline
        };
        if (url === 'https://jokeservice69.herokuapp.com/') {
            try {
                const response = await fetch('/api/jokes/' + id, {
                    method: 'PUT',
                    body: JSON.stringify(msg),
                    headers: {'Content-Type': 'application/json'}
                })
                const json = await response.json();
                console.log(`Resultat: %o`, json);
                alert('Your joke has been saved');
                updateJokes();
            } catch (err) {
                alert('Noget gik galt: ', err);
                console.log(err);
            }
        } else {
            try {
                const response = await fetch('/api/othersite/jokes/' + id, {
                    method: 'PUT',
                    body: JSON.stringify(msg),
                    headers: {'Content-Type': 'application/json'}
                })
                const json = await response.json();
                console.log(`Resultat: %o`, json);
                alert('Your joke has been saved');
                updateJokes();
            } catch (err) {
                alert('Noget gik galt: ', err);
                console.log(err);
            }
        }
    }
}

async function editOtherJoke(id) {
    const url = serviceContainer.options[serviceContainer.selectedIndex].id;
    const setup = document.getElementById('setup-' + id).innerText;
    const punchline = document.getElementById('punchline-' + id).innerText;
    if (setup.length > 0 && punchline.length > 0) {
        const msg = {url: url, setup: setup, punchline: punchline};
        try {
            const response = await fetch('/api/othersite/jokes/' + id, {
                method: 'PUT',
                body: JSON.stringify(msg),
                headers: {'Content-Type': 'application/json'}
            })
            const json = await response.json();
            console.log(`Resultat: %o`, json);
            alert('Your joke has been saved');
            updateJokes();
        } catch (err) {
            alert('Noget gik galt: ', err);
            console.log(err);
        }
    }
}

btnPost.onclick = async () => {
    let setup = document.getElementById('setup').value;
    let punchline = document.getElementById('punchline').value
    if (setup.length > 0 && punchline.length > 0) {
        const msg = {
            setup: setup,
            punchline: punchline,
        };
        try {
            const response = await fetch('/api/jokes', {
                method: "POST",
                body: JSON.stringify(msg),
                headers: {'Content-Type': 'application/json'}
            })
            const json = await response.json();
            console.log(`Resultat: %o`, json);
            alert('Your new joke has been saved');
            updateJokes();
        } catch (err) {
            console.log(err);
        }
    }
}

btnDeleteService.onclick = async () => {
    const data = {address: 'https://jokeservice69.herokuapp.com/', secret: 'daddy'};
    try {
        const service = await fetch('/api/services', {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })

        const json = await service.json();
        console.log(`Resultat: %o`, json);
    } catch (err) {
        console.log(err);
    }
}

btnCreateService.onclick = async () => {
    const data = {name: 'Dad jokes', address: 'https://jokeservice69.herokuapp.com/', secret: 'daddy'};
    try {
        const service = await fetch('https://krdo-joke-registry.herokuapp.com/api/services', {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        console.log(service);
    } catch (err) {
        console.log(err);
    }
}
