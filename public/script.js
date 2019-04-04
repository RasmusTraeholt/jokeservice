const jokeContainer = document.getElementById('jokes');
const btnPost = document.getElementById('btnPost');

//setOnClicks();
update();

function update() {
    jokeContainer.innerHTML = '';
    for (let input of document.querySelectorAll('input')) input.value = '';

    getJokes();
}

async function getJokes() {
    const [template, jokeResponse] = await Promise.all([fetch('/joke.hbs'), fetch('/joke')]);
    const [templateText, jokes] = await Promise.all([template.text(), jokeResponse.json()]);
    const compiledTemplate = Handlebars.compile(templateText);
    let jokesHTML = '';
    let optionsHTML = '';
    jokes.forEach(joke => {
        jokesHTML += compiledTemplate({
            setup: joke.setup,
            punchline: joke.punchline
        });
        optionsHTML += '<option data="' + joke._id + '">' + joke._id + '</option>';
    });
    jokeContainer.innerHTML = jokesHTML;
    //document.querySelector('#createPicker').innerHTML = optionsHTML;
    //$('.selectpicker').selectpicker('refresh');
}

btnPost.onclick = () => {
    let setup = document.getElementById('setup').value;
    let punchline = document.getElementById('punchline').value
    if (setup.length > 0 && punchline.length > 0) {
        const msg = {
            setup: setup,
            punchline: punchline,
        };
        fetch('/joke', {
            method: "POST",
            body: JSON.stringify(msg),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (response.status >= 400)
                    throw new Error(response.status);
                else
                    update();
                return response.json();
            })
            .then(resultat => console.log(`Resultat: %o`, resultat))
            .catch(fejl => console.log('Fejl: ' + fejl));
    }
}

/*
function setOnClicks() {
    document.querySelector('#submitJoke').onclick = () => {
        const msg = {
            name: document.querySelector('#compName').value,
            hours: document.querySelector('#compHours').value,
        };
        fetch('/company', {
            method: "POST",
            body: JSON.stringify(msg),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (response.status >= 400)
                    throw new Error(response.status);
                else
                    update();
                return response.json();
            })
            .then(resultat => console.log(`Resultat: %o`, resultat))
            .catch(fejl => console.log('Fejl: ' + fejl));
    };

    document.querySelector('#submitEmployee').onclick = () => {
        const msg = {
            name: document.querySelector('#empName').value,
            title: document.querySelector('#empTitle').value,
            wage: document.querySelector('#empWage').value,
            companyId: document.querySelector('option:checked').getAttribute('data'),
            employmentDate: Date.now(),
        };
        fetch('/employee', {
            method: "POST",
            body: JSON.stringify(msg),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (response.status >= 400)
                    throw new Error(response.status);
                else
                    update();
                return response.json();
            })
            .then(resultat => console.log(`Resultat: %o`, resultat))
            .catch(fejl => console.log('Fejl: ' + fejl));
    };
}*/
