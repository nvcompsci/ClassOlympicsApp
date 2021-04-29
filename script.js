//Build 27.3: 4/29/21 9:43AM
//document.querySelector('h1').innerHTML = "Class Olympics (temp unlock for testing)"
const url = 'https://script.google.com/macros/s/AKfycbwFPH7SSqFZ3Tn-nDR4DGlkzGMJK0KnRSXlO7wY2QTgfqapdoc/exec'
const devUrl = 'https://script.google.com/a/sylvaniaschools.org/macros/s/AKfycbx-fJD1dQlWlvZz9eg0YH4ahICo96YWlQLVSgxYLrY/dev'

const h = {
    'name':0,
    'isCompetitive':1,
    'teachers':2,
    'spots':3,
    'location':5,
    'desc':7
}

let data = {}
var profile = undefined
let currentSelection = null
let student_id = null

$('.hideAtStart').hide()

axios.post(url + "?route=getEvents")
.then((res) => {
    console.log(res)
    data = res.data;
    $('#events-container').empty().append(createEventCards(res.data.events))
    //$('div.event-card button').click(handleButtonClick)
    $('div.event-card').click(handleCardClick)
    $('div.event-card').first().remove()
}).catch((error) => {
    document.append(error);
    console.error(error)
})

function createEventCards(events) {
return events.map((event) => 
    $(`<div id='${event[h.name]}' class='event-card card'>
    ${event[h.isCompetitive] == false ? "<span class='badge badge-info'>Non-Competitive</span>" : ""}    
    <h6>${event[h.name]}</h6>        
        <ul>
            <li><strong>Description:</strong> ${event[h.desc]}</li>
            <li><strong>Location:</strong> ${event[h.location]}</li>
            <li><strong>Teacher(s):</strong> ${event[h.teachers]}</li>
            <li><strong>Instructions:</strong> ${ (event[h.instructions]) ? event[h.instructions] : ''}
        </ul>
        <button type=button class='btn btn-primary' disabled>Select</button>
    </div>`)
)
}

function createMyEventCard(event) {
    return $(`<div class='my-event-card card'>
            <h6>My Event: ${event[h.name]}</h6>
            <ul>
                <li><strong>Description:</strong> ${event[h.desc]}</li>
                <li><strong>Location:</strong> ${event[h.location]}</li>
                <li><strong>Teacher(s):</strong> ${event[h.teachers]}</li>
                <li><strong>Instructions:</strong> ${ (event[h.instructions]) ? event[h.instructions] : ''}
            </ul>
        </div>`)    
    }

function disableEmptyEvents() {
    const grade = data.student[data.n.s['Grade_Level']]
    data.spots.filter(spotData => spotData[data.n.spots[grade]] <= 0)
        .forEach(spotData => {
            const event = spotData[0]
            disableCard( $(`div[id='${event}']`) )    
            console.log(`disable ${event}`)
        })
}

function disableCard($card) {
    $card.addClass('bg-dark')
        .children('button')
            .prop("disabled",true)
            .text('Full')
}

$("button#login").click(e => {
    e.preventDefault()
    const sid = $('input[type="number"]').val()
    axios.post(`${url}?route=login&student=${sid}`)
        .then((res) => {
            data.spots = res.data.spots
            data.student = res.data.student
            data.n = res.data.n
            console.log(res)
            $('input[name=first]').val(res.data.student[data.n.s['First_Name']])
            $('input[name=last]').val(res.data.student[data.n.s['Last_Name']])
            $('input[name=grade]').val(res.data.student[data.n.s['Grade_Level']])
            $('input[name=event]').val(res.data.student[data.n.s['Event']])
            const myEventName = res.data.student[data.n.s['Event']]
            if (res.data.student[data.n.s['Event']]) {
                $('button#signup').text('Change Event')
                .prepend($(`<span 
                    class="badge badge-secondary">
                    (Locked) <del>Step 4: Submit</del>
                    </span>`))
                .prop('disabled',true)
                $('input[name=event]').removeClass('bg-danger').addClass('bg-success')
                const myEvent = data.events.filter(event => event[0] == myEventName)[0]
                $('input[name=event]').after(createMyEventCard(myEvent))
            } else
                $('input[name=event]').addClass('bg-danger')
            $('.hideAtStart').show()
            $('#events-container').empty().append(createEventCards(data.events))
            $('div.event-card button')
                .click(handleButtonClick)
                .removeAttr('disabled')
            $('div.event-card').click(handleCardClick)
            $('div.event-card').first().remove()
            disableEmptyEvents()
            $('div#loginError').remove()
        }).catch((error) => {
            const $alert = $(
                `<div id='loginError' class='alert alert-danger'>
                <strong>Login Error! This is not a valid account.</strong><em>Error: ${error}</em>
                </div>`)
            $('button#login').after($alert)
            console.error(error)
        })
})

$("button#signup").click(e => {
    e.preventDefault()
    const event = $('input[name=selection]').val()
    if (profile === undefined) {
        const $alert = $(
            `<div id='oauthMissing' class='alert alert-danger'>
            You must be signed into your <strong>school account</strong> through Google to submit.
            </div>`)
        $('button#signup').after($alert)
    } else {
        const $alert = $(
            `<div id='sendingRequest' class='alert alert-warning'>
            <span class="spinner-grow spinner-grow-sm text-warning"></span>Submitting request...
            </div>`)
        $('button#signup').after($alert)
    }
    const sid = profile.getEmail().split('@')[0]
    axios.post(`${url}?route=signup&student=${sid}&event=${event}`)
        .then((res) => {
            data.spots = res.data.spots
            data.student = res.data.student
            data.n = res.data.n
            $('#sendingRequest').remove()
            if (res.data.result == 400)
                throw new Error('Sorry, no spots are left in that event.')
            $('input[name=event]').val(data.student[data.n.s['Event']])
                .removeClass('bg-danger')
                .addClass('bg-success')
            $("input[name=selection]")
                .removeClass('bg-warning')
                .addClass('bg-success')
            const $alert = $(
                `<div id='submitSuccess' class='alert alert-success'>
                <strong>Success!</strong> You are now signed up for ${data.student[data.n.s['Event']]}
                </div>`)
            $('button#signup')
                .text('Change Event')
                .removeClass('bg-warning')
                .addClass('bg-primary')
            $('button#signup').after($alert)
            $('div.my-event-card').remove()
            const myEventName = data.student[data.n.s['Event']]
            const myEvent = data.events.filter(event => event[0] == myEventName)[0]
            $('input[name=event]').after(createMyEventCard(myEvent))
            console.log(res)
        }).catch((error) => {
            const $alert = $(
                `<div id='submitError' class='alert alert-danger'>
                <strong>Sorry! There was an error registering.</strong><em>Error: ${error}</em>
                </div>`)
            $('button#signup').after($alert)
            console.error(error)
        })
})

function handleButtonClick(e) {
    let thisElem = $(e.target)
    $('.event-card button').removeClass('btn-success').addClass('btn-primary')
    thisElem.addClass('btn-success')
    let thisEvent = thisElem.siblings('h6').text();
    currentSelection = thisEvent
    $("input[name=selection]")
        .val(thisEvent)
        .show()
        .addClass('bg-warning')
    checkReadyToSubmit()
}

function onReadyToSubmit() {
    $('button#signup')
        .removeClass('bg-primary')
        .addClass('bg-warning')
        //.after($('<span class="spinner-grow spinner-grow-sm text-warning"></span>'))
        //.removeAttr('disabled')
}

function checkReadyToSubmit() {
    if (profile && currentSelection)
        onReadyToSubmit()
}

function handleCardClick() {   
    $('.event-card').removeClass('expanded')
        .children('ul').hide()
    $(this).addClass("expanded")
        .children('ul').show()
}

function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    //$('.g-signin2 span').html('<span class="badge badge-info">Step 2: Verify Account</span>')
    checkReadyToSubmit()
    try {
    $('input[type="number"]').val(parseInt(profile.getEmail().split("@")[0]))
    $("button#login").click()
    } catch (err) {
        alert("This Google Account is not a valid Sylvania Schools account.",err)
    }
    //console.log('ID: ' + profile.getId());
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail());
}

function onGoogleLoad() {
    //$('.g-signin2 span').html('<span class="badge badge-info">Step 2: Verify Account</span>')
}

function onFailure(err) {
    console.error(err)
    $('.g-signin2 span').html('<span class="badge badge-warning">ERROR! Step 2: Verify Account</span>')
}

function headerInds(headers) {
    var inds = {};
    for (var i = 0; i < headers.length; i++) {
        inds[headers[i]] = i;
    }
    return inds;
}
