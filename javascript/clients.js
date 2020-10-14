var ref = firebase.database().ref('clients')
let loading = document.createElement('div')
loading.innerText = 'Carregando'

let invalidFields = []
function validateForm(form) {
    let formResult = {}
    let formElementNames
    let formName
    if (form == 'login') {
        formElementNames = ["password", "email"]
        formName = "login"
    } else if (form == 'packages') {
        formElementNames = ["school", "accomodations", "duration", "language", "price", "city", "country"]
        formName = "packages"
    } else {
        formElementNames = ["telephone", "email", "cpf", "rg", "birthDate", "name"]
        formName = "clients"
    }

    formElementNames.forEach(element => {
        var formElement = document.forms[formName][element];
        toogleEmpty(formElement)
    });

    if (!invalidFields.length) {
        formElementNames.forEach(element => {
            var formElement = document.forms[formName][element];
            // var outString = formElement.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
            var item = { [element]: formElement.value }
            formResult = { ...formResult, ...item }
        });
    }

    if (Object.keys(formResult).length == formElementNames.length) {
        return formResult
    }
    console.log({ formResult })
    // console.log({ invalidFields })
}

function validateEmailField(element) {
    if (!element.value || !element.value.includes('@') || !element.value.includes('.')) {
        element.classList.add('empty')
        element.focus()
        if (!invalidFields.includes(element.name)) {
            invalidFields.push(element.name)
        }
    } else {
        element.classList.remove('empty')
        invalidFields = invalidFields.filter(item => item !== element.name)
    }
}

function validateTelephoneField(element) {
    console.log(element.value, element.value.length)
    if (element.value.length < 15) {
        element.classList.add('empty')
        element.focus()
        if (!invalidFields.includes(element.name)) {
            invalidFields.push(element.name)
        }
    } else {
        element.classList.remove('empty')
        invalidFields = invalidFields.filter(item => item !== element.name)
    }
}

function toogleEmpty(element) {
    if (element.name == 'email') validateEmailField(element)
    else if (element.name == 'telephone') validateTelephoneField(element)
    else {
        if (!element.value) {
            element.classList.add('empty')
            element.focus()
            if (!invalidFields.includes(element.name)) {
                invalidFields.push(element.name)
            }
        } else {
            element.classList.remove('empty')
            invalidFields = invalidFields.filter(item => item !== element.name)

        }
    }
}

function mask(o, type) {
    var v = mphone(o.value);
    if (v != o.value) {
        o.value = v;
    }
}

function mphone(v) {
    var r = v.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
        r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
        r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
        r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
        r = r.replace(/^(\d*)/, "$1");
    }
    return r;
}


async function writeData(data) {
    ref.push(data);
}

async function handleSubmit() {
    let defaultData = window.history.state && window.history.state.data

    let newData = validateForm('clients')
    if (defaultData) updateData(defaultData.id, newData)
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
        document.getElementById('clients').removeChild(loading)
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