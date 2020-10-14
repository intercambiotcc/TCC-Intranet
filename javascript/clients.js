var ref = firebase.database().ref('clients')
import { validateForm } from './formValidate'
let loading = document.createElement('div')
loading.innerText = 'Carregando'

// let invalidFields = []

async function writeData(data) {
    ref.push(data);
}

async function handleSubmit() {
    let defaultData = window.history.state && window.history.state.data

    let newData = validateForm('clients')
    if (defaultData)   updateData(defaultData.id, newData)
    else writeData(newData)
}
async function updateData(id, newData) {
    console.log(newData)

    ref.child(id).update(newData).then(() => {
        // count.innerText = countNumber
    })
}

function loadData() {

    checkAuthentication()
    document.getElementById('clients').appendChild(loading)

    ref.on('child_added', snapshot => {

        if (snapshot.exists()) {

            let val = snapshot.val()
            loadItem(val, snapshot.key)
        }
        // document.getElementById('clients').removeChild(loading)
    })
    ref.on('child_changed', snapshot => {

        if (snapshot.exists()) {

            let val = snapshot.val()
            loadItem(val, snapshot.key)
        }
        document.getElementById('clients').removeChild(loading)
    })
}
function deleteData(id) {
    console.log({ id })
    ref.child(id).remove().then(() => {
        var clientRemoved = document.getElementById(id)
        clientRemoved.remove()
    })
}
function updateClient(id) {

    ref.child(id).once('value').then(snapshot => {
        let val = snapshot.val()
        let newData = { ...val, id }
        console.log({ val })
        window.history.pushState({ data: newData }, '', 'clientesCadastro.html')
        window.location.assign('clientesCadastro.html')
    })
}

function loadItem(element, key) {

    let row = document.createElement("tr");
    let tdName = document.createElement("td")
    let tdBirthDate = document.createElement("td")
    let tdEmail = document.createElement("td")
    let tdCpf = document.createElement("td")
    let tdTelephone = document.createElement("td")
    let tdActions = document.createElement("td")
    let editSpan = document.createElement("span")
    let removeSpan = document.createElement("span")

    row.id = key

    tdName.innerText = element.name;
    tdBirthDate.innerText = element.birthDate;
    tdEmail.innerText = element.email;
    tdCpf.innerText = element.cpf;
    tdTelephone.innerText = element.telephone;

    removeSpan.classList.add("iconify")
    removeSpan.classList.add("remove")
    removeSpan.setAttribute('data-icon', 'ant-design:delete-filled')
    removeSpan.setAttribute('data-inline', 'false')
    removeSpan.setAttribute('onclick', "deleteData('" + key + "')");

    editSpan.classList.add("iconify")
    editSpan.setAttribute('data-icon', 'ant-design:edit-filled')
    editSpan.setAttribute('data-inline', 'false')
    editSpan.setAttribute('onclick', "updateClient('" + key + "')");

    tdActions.appendChild(editSpan)
    tdActions.appendChild(removeSpan)

    row.appendChild(tdName)
    row.appendChild(tdBirthDate)
    row.appendChild(tdEmail)
    row.appendChild(tdCpf)
    row.appendChild(tdTelephone)
    row.appendChild(tdActions)

    document.getElementById('clients').appendChild(row)
}

function checkAuthentication() {
    // firebase.auth().onAuthStateChanged(function (user) {
    //     if (user) {
    //         console.log('Tem logado: ', user)
    //         // User is signed in.
    //     } else {
    //         console.log('Não: ', user)
    //         // No user is signed in.
    //     }
    // });


    // user.updateProfile({
    //     displayName: "Jane Q. User",
    //     photoURL: "https://example.com/jane-q-user/profile.jpg"
    // }).then(function () {
    //     // Update successful.
    // }).catch(function (error) {
    //     // An error happened.
    // });
}