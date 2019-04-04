const postContainer = document.getElementById('posts');

//setOnClicks();
update();

function update() {
    postContainer.innerHTML = '';
    for (let input of document.querySelectorAll('input')) input.value = '';

    getPosts();
}

async function getPosts() {
    const [template, postResponse] = await Promise.all([fetch('/post.hbs'), fetch('/post')]);
    const [templateText, posts] = await Promise.all([template.text(), postResponse.json()]);
    const compiledTemplate = Handlebars.compile(templateText);
    let postsHTML = '';
    let optionsHTML = '';
    posts.forEach(post => {
        postsHTML += compiledTemplate({
            setup: post.setup,
            punchline: post.punchline
        });
        optionsHTML += '<option data="' + post._id + '">' + post._id + '</option>';
    });
    postContainer.innerHTML = postsHTML;
    //document.querySelector('#createPicker').innerHTML = optionsHTML;
    //$('.selectpicker').selectpicker('refresh');
}

/*
function setOnClicks() {
    document.querySelector('#submitPost').onclick = () => {
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
