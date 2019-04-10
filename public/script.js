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
    document.getElementById('postJokeContainer').style.display = 'none';
    document.getElementById('serviceAddress').innerText = '';
    for (let input of document.querySelectorAll('input')) input.value = '';
    if (serviceContainer.value != '0' && serviceContainer.value) {
        getJokes(serviceContainer.value);
    }
}

async function getJokes(id) {
    jokeContainer.innerHTML = '<span id="statusText">Loading latest 50 jokes from: '
    +  serviceContainer.options[serviceContainer.selectedIndex].id
    + '</span><img class="svg" alt="loading.gif" src="loading.svg">';
    try {
        const [template, response] = await Promise.all([fetch('/joke.hbs'), fetch('/api/otherjokes/' + id)]);
        if (response.status >= 400 || !response) {
            throw new Error('No JSON to fetch');
        }
        const [templateText, jokes] = await Promise.all([template.text(), response.json()]);
        const compiledTemplate = Handlebars.compile(templateText);

        let jokesHTML = '';

        if (jokes.length > maxJokes) {
            for (let i = jokes.length-1; i >= jokes.length-maxJokes; i--) {
                jokesHTML += compiledTemplate({
                    id: jokes[i]._id,
                    setup: jokes[i].setup,
                    punchline: jokes[i].punchline
                });
            };
        } else {
            for (let i = jokes.length-1; i >= 0; i--) {
                jokesHTML += compiledTemplate({
                    id: jokes[i]._id,
                    setup: jokes[i].setup,
                    punchline: jokes[i].punchline
                });
            }
        }
       
        jokeContainer.innerHTML = jokesHTML;
        document.getElementById('postJokeContainer').style.display = 'block';
        document.getElementById('serviceAddress').innerText = serviceContainer.options[serviceContainer.selectedIndex].id;

       /* jokes.forEach(joke => {
            jokesHTML += compiledTemplate({
                id: joke._id,
                setup: joke.setup,
                punchline: joke.punchline,
            });
        });*/
    } catch (err) {
        console.log(err);
        jokeContainer.innerHTML = '<span id="statusText">Failed to fetch jokes from: <a href="' 
        + serviceContainer.options[serviceContainer.selectedIndex].id + '">' 
        + serviceContainer.options[serviceContainer.selectedIndex].id +'</a></span>';
    }
}

async function getServices() {
    try {
        const [template, response] = await Promise.all([fetch('/service.hbs'), fetch('/api/othersites')]);
        if (response.status >= 400 || !response) {
            throw new Error('Filed to fetch');
        }
    const [templateText, services] = await Promise.all([template.text(), response.json()]);
    const regex = /^(https:|http:|www\.)\S*/;
    const compiledTemplate = Handlebars.compile(templateText);
    let HTML = '<option value="0" disabled selected>Select a site</option>';
    services.forEach(service => {
        if(regex.test(service.address)) {
            HTML += compiledTemplate({
                id: service._id,
                name: service.name,
                address: service.address,
                secret: service.secret
            });
        }
    });
        serviceContainer.innerHTML = HTML;
    } catch (err) {
        console.log(err);
    }  
}

async function deleteJoke(id) {
    try {
        const response = await fetch('/api/othersite/jokes/' + serviceContainer.value + '/' + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        if (response.status >= 400 || !response) {
            throw new Error('Failed to fetch');
        }
        const json = await response.json();
        console.log(`Resultat: %o`, json);
        updateJokes();
    } catch (err) {
        console.log(err);
    }
}

async function editJoke(id) {
    const setup = document.getElementById('setup-' + id).innerText;
    const punchline = document.getElementById('punchline-' + id).innerText;
    if (setup.length > 0 && punchline.length > 0) {
        const msg = {setup: setup, punchline: punchline};
        try {
            const response = await fetch('/api/othersite/jokes/' + serviceContainer.value + '/' + id, {
                method: 'PUT',
                body: JSON.stringify(msg),
                headers: {'Content-Type': 'application/json'}
            })
            if (response.status >= 400 || !response) {
                throw new Error('Failed to fetch');
            }
            const json = await response.json();
            console.log(`Resultat: %o`, json);
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
        const msg = {setup: setup, punchline: punchline};
        try {
            const response = await fetch('/api/othersite/jokes/' + serviceContainer.value, {
                method: "POST",
                body: JSON.stringify(msg),
                headers: {'Content-Type': 'application/json'}
            })
            if (response.status >= 400 || !response) {
                throw new Error('Failed to fetch');
            }
            const json = await response.json();
            console.log(`Resultat: %o`, json);
            updateJokes();
        } catch (err) {
            alert('Noget gik galt: ', err);
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
        if (response.status >= 400 || !response) {
            throw new Error('Failed to fetch');
        }
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
        if (response.status >= 400 || !response) {
            throw new Error('Failed to fetch');
        }
        console.log(service);
    } catch (err) {
        console.log(err);
    }
}
