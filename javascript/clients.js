var ref = firebase.database().ref('clients')
// import {validateForm} from './formValidate'
let invalidFields = []

function validateForm(form) {
    console.log('this')
    let formResult = {}
    let formElementNames
    let formName
    if (form == 'login') {
        formElementNames = ["password", "email"]
        formName = "login"
    } else {
        formElementNames = ["telephone", "email", "cpf", "rg", "birthDate", "name"]
        formName = "clients"
    }

    console.log({ formElementNames, formName })

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

    if (form == 'clients') {
        if (Object.keys(formResult).length == formElementNames.length) {
            return formResult
        }
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
    console.log({ element })
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

function mask(o, f) {
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

async function writeData() {
    let data = validateForm('clients')

    ref.push(data);
}


async function handleSubmit(type) {
    if (window.location.data) {
        updateData(id, data)
    } else {
        writeData()
    }
}
async function updateData(id, newData) {
    // ref.child(id).update({ curtidas: countNumber }).then(() => {
    //     count.innerText = countNumber
    // })
}

function loadClients() {
    ref.on('child_added', snapshot => {

        if (snapshot.exists()) {

            let val = snapshot.val()
            loadItem(val, snapshot.key)
        }
    })
    ref.on('child_changed', snapshot => {

        if (snapshot.exists()) {

            let val = snapshot.val()
            loadItem(val, snapshot.key)
        }
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
        console.log({ val })
        window.history.pushState({ data: val }, '', 'clientesCadastro.html')
        window.location.assign('clientesCadastro.html')
    })
}

function loadItem(element, key) {

    //     let content = `
    //     <tr>
    //      <td>${element.name}</td>
    //      <td>${element.birthDate}</td>
    //      <td>${element.email}</td>
    //      <td>${element.cpf}</td>
    //      <td>${element.telephone}</td>
    //      <td>
    //          <span class="iconify" data-inline="false" data-icon="ant-design:edit-filled"
    //              style="font-size: 20px;">
    //          </span>
    //          <span class="iconify" data-inline="false" data-icon="ant-design:delete-filled"
    //              style="font-size: 20px;"
    //              onclick="${deletar(key)}"
    //              ></span>
    //      </td>
    //  </tr>
    //` 
    console.log('element: ', element)
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