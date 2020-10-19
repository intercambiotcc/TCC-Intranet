var ref = firebase.database().ref('feedbacks')


function loadingMessage() {

    return `<div id='loading'>
        <h1> Carregando </h1>
        <img src='./img/loading.gif' alt='loading'>
    </div>`
}

function loadData() {

    document.getElementById('feedbacks').innerHTML = loadingMessage()

    ref.on('child_added', snapshot => {
        if (snapshot.exists()) loadItem(snapshot.val(), snapshot.key)
        if (document.getElementById('loading')) {
            document.getElementById('loading').remove()
        }
    })
}

function checkMessages(element){
    const formatedElement = JSON.parse(element)
    const {aboutTheTrip, aboutTheAgency} = formatedElement
    console.log(aboutTheTrip, aboutTheAgency)
}


function loadItem(element, key) {

    let row = document.createElement("tr");
    let tdName = document.createElement("td")
    let tdTripDate = document.createElement("td")
    let tdEmail = document.createElement("td")
    let tdCountry = document.createElement("td")
    let tdLanguage = document.createElement("td")
    let tdTelephone = document.createElement("td")
    let tdActions = document.createElement("td")

    row.id = key

    tdName.innerText = element.name;
    tdTripDate.innerText = element.birthDate;
    tdEmail.innerText = element.email;
    tdCountry.innerText = element.country;
    tdLanguage.innerText = element.language;
    tdTelephone.innerText = element.telephone;
    tdActions.innerText = 'Ver mensagens'

    tdActions.setAttribute('onclick', "checkMessages('" + JSON.stringify(element) + "')");

    row.appendChild(tdName)
    row.appendChild(tdEmail)
    row.appendChild(tdTelephone)
    row.appendChild(tdCountry)
    row.appendChild(tdLanguage)
    row.appendChild(tdTripDate)
    row.appendChild(tdActions)

    document.getElementById('feedbacks').appendChild(row)
}
