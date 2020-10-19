var ref = firebase.database().ref('contact-us')

function loadingMessage() {
    return `<div id='loading'>
        <h1> Carregando </h1>
        <img src='./img/loading.gif' alt='loading'>
    </div>`
}


function loadMessages() {
    document.getElementById('contact-us').innerHTML = loadingMessage()

    ref.on('child_added', snapshot => {
        loadItem(snapshot.val(), snapshot.key)
        if (document.getElementById('loading')) {
            document.getElementById('loading').remove()
        }
    }
    )
}

function loadItem(element, key) {

    let row = document.createElement("tr");
    let tdName = document.createElement("td")
    let tdEmail = document.createElement("td")
    let tdTelephone = document.createElement("td")
    let tdCountry = document.createElement("td")
    let tdLanguage = document.createElement("td")

    row.classList.add(key)

    tdName.innerText = element.name;
    tdEmail.innerText = element.email;
    tdTelephone.innerText = element.telephone;
    tdCountry.innerText = element.country;
    tdLanguage.innerText = element.language;

    row.appendChild(tdName)
    row.appendChild(tdEmail)
    row.appendChild(tdTelephone)
    row.appendChild(tdCountry)
    row.appendChild(tdLanguage)

    document.getElementById('contact-us').appendChild(row)
}

