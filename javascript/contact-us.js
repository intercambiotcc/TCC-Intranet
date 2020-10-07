var ref = firebase.database().ref('contact-us')

function loadMessages() {

    ref.on('child_added', snapshot => {
        let val = snapshot.val()
        loadItem(val, snapshot.key)

    })
}

function loadItem( element, key) {

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

    document.getElementById('messages').appendChild(row)
}