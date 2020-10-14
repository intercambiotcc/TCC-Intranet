var ref = firebase.database().ref('packages')
let loading = document.createElement('div')
loading.innerText = 'Carregando'

// let invalidFields = []

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
        formElementNames = ["telephone", "email", "cpf", "rg", "birthDate", "gender", "name"]
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
    else if (element.name == 'cpf') ValidaCPF()
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
    var v
    if (type == 'cpf') v = mcpf(o.value)
    else v = mphone(o.value);
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

    let newData = validateForm('packages')
    if (defaultData) {
        updateData(defaultData.id, newData)
    } else {
        console.log('vai dar push')
        writeData(newData)
    }
}
async function updateData(id, newData) {
    console.log(newData)

    ref.child(id).update(newData).then(() => {
        // count.innerText = countNumber
    })
}

function loadData() {
console.log('chegou')
    // document.getElementById('packages').appendChild(loading)

    ref.on('child_added', snapshot => {

        if (snapshot.exists()) {

            let val = snapshot.val()
            
            loadItem(val, snapshot.key)
        }
        // document.getElementById('packages').removeChild(loading)
    })
    ref.on('child_changed', snapshot => {

        if (snapshot.exists()) {

            let val = snapshot.val()
            loadItem(val, snapshot.key)
        }
        // document.getElementById('packages').removeChild(loading)
    })
}
function deleteData(id) {
    console.log({ id })
    ref.child(id).remove().then(() => {
        var clientRemoved = document.getElementById(id)
        clientRemoved.remove()
    })
}
function updatePackage(id) {

    ref.child(id).once('value').then(snapshot => {
        let val = snapshot.val()
        let newData = { ...val, id }
        console.log({ val })
        window.history.pushState({ data: newData }, '', 'pacotesCadastro.html')
        window.location.assign('pacotesCadastro.html')
    })
}

function loadItem(element, key) {
    formElementNames = ["school", "accomodations", "duration", "language", "price", "city", "country"]

    let row = document.createElement("tr");
    let tdCountry = document.createElement("td")
    let tdCity = document.createElement("td")
    let tdLanguage = document.createElement("td")
    let tdDuration = document.createElement("td")
    let tdPrice = document.createElement("td")
    let tdSchool = document.createElement("td")
    let tdAccomodations = document.createElement("td")
    let tdActions = document.createElement("td")
    let editSpan = document.createElement("span")
    let removeSpan = document.createElement("span")

    row.id = key

    tdCountry.innerText = element.country;
    tdCity.innerText = element.city;
    tdLanguage.innerText = element.language;
    tdDuration.innerText = element.duration;
    tdPrice.innerText = element.price;
    tdAccomodations.innerText = element.accomodations;
    tdSchool.innerText = element.school;

    removeSpan.classList.add("iconify")
    removeSpan.classList.add("remove")
    removeSpan.setAttribute('data-icon', 'ant-design:delete-filled')
    removeSpan.setAttribute('data-inline', 'false')
    removeSpan.setAttribute('onclick', "deleteData('" + key + "')");

    editSpan.classList.add("iconify")
    editSpan.setAttribute('data-icon', 'ant-design:edit-filled')
    editSpan.setAttribute('data-inline', 'false')
    editSpan.setAttribute('onclick', "updatePackage('" + key + "')");

    tdActions.appendChild(editSpan)
    tdActions.appendChild(removeSpan)

    row.appendChild(tdCountry)
    row.appendChild(tdCity)
    row.appendChild(tdLanguage)
    row.appendChild(tdDuration)
    row.appendChild(tdPrice)
    row.appendChild(tdSchool)
    row.appendChild(tdAccomodations)
    row.appendChild(tdActions)

    document.getElementById('packages').appendChild(row)
}