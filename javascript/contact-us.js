var ref = firebase.database().ref('contact-us')

function loadingMessage() {
    return `<div class='loading'>
        <h1> Carregando </h1>
        <img src='./img/loading.gif' alt='loading'>
    </div>`
}


function loadMessages() {
    document.getElementById('contact-us').innerHTML = loadingMessage()

    ref.on('child_added', snapshot => loadItem(snapshot.val(), snapshot.key))

    var elements = document.querySelectorAll('.loading')
    var i

    for (i = 0; i < elements.length; i++) {
        console.log(elements[i])
        elements[i].remove()
    }
    // var elems = document.querySelectorAll(".loading");
    // console.log(elems)
    // elems.forEach(function (element) {
    //     console.log({element})
    //     element.parentNode.removeChild(element);
    // });
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

