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

function checkMessages(element) {

    const formatedElement = JSON.parse(element)
    const { name, message} = formatedElement

    var modal = document.getElementById("myModal");
    var messageContent = document.getElementById("message");
    var title = document.getElementById("title");

    modal.style.display = "block";
    title.innerText = `Mensagens de ${name}`
    messageContent.innerText = message

}

function loadItem(element, key) {

    let row = document.createElement("tr");
    let tdName = document.createElement("td")
    let tdEmail = document.createElement("td")
    let tdTelephone = document.createElement("td")
    let tdCountry = document.createElement("td")
    let tdLanguage = document.createElement("td")
    let tdActions = document.createElement("td")

    row.classList.add(key)

    tdName.innerText = element.name;
    tdEmail.innerText = element.email;
    tdTelephone.innerText = element.telephone;
    tdCountry.innerText = element.country;
    tdLanguage.innerText = element.language;
    tdActions.style.cursor = 'pointer'
    tdActions.innerText = 'Exibir'
    tdActions.id = 'myBtn'

    tdActions.setAttribute('onclick', "checkMessages('" + JSON.stringify(element) + "')");

    row.appendChild(tdName)
    row.appendChild(tdEmail)
    row.appendChild(tdTelephone)
    row.appendChild(tdCountry)
    row.appendChild(tdLanguage)
    row.appendChild(tdActions)

    document.getElementById('contact-us').appendChild(row)
}

