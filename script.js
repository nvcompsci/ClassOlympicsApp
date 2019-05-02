const url = 'https://script.google.com/macros/s/AKfycbwFPH7SSqFZ3Tn-nDR4DGlkzGMJK0KnRSXlO7wY2QTgfqapdoc/exec'
const devUrl = 'https://script.google.com/a/sylvaniaschools.org/macros/s/AKfycbx-fJD1dQlWlvZz9eg0YH4ahICo96YWlQLVSgxYLrY/dev'

const h = {
    'name':0,
    'teachers':2,
    'spots':3,
    'location':5,
    'desc':7
}

let data = {}

$('.hideAtStart').hide()

axios.post(url + "?route=getEvents")
.then((res) => {
    console.log(res)
    data = res.data;
    $('#events-container').empty().append(createEventCards(res.data.events))
    $('div.event-card button').click(handleButtonClick)
    $('div.event-card').click(handleCardClick)
    $('div.event-card').first().remove()
}).catch((error) => {
    document.append(error);
    console.error(error)
})

function createEventCards(events) {
return events.map((event) => 
    $(`<div id='${event[h.name]}' class='event-card card'>
        <h6>${event[h.name]}</h6>
        <ul>
            <li><strong>Description:</strong> ${event[h.desc]}</li>
            <li><strong>Location:</strong> ${event[h.location]}</li>
            <li><strong>Teacher(s):</strong> ${event[h.teachers]}</li>
        </ul>
        <button type=button class='btn btn-primary'>Select</button>
    </div>`)
)
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
            if (res.data.student[data.n.s['Event']]) {
                $('button#signup').text('Change Event')
                $('input[name=event]').removeClass('bg-danger').addClass('bg-success')
            } else
                $('input[name=event]').addClass('bg-danger')
            $('.hideAtStart').show()
            $('#events-container').empty().append(createEventCards(data.events))
            $('div.event-card button').click(handleButtonClick)
            $('div.event-card').click(handleCardClick)
            $('div.event-card').first().remove()
            disableEmptyEvents()
            $('div#loginError').remove()
        }).catch((error) => {
            const $alert = $(
                `<div id='loginError' class='alert alert-danger'>
                <strong>Login Error!</strong> ${error}
                </div>`)
            $('button#login').after($alert)
            console.error(error)
        })
})

$("button#signup").click(e => {
    e.preventDefault()
    const event = $('input[name=selection]').val()
    const sid = $('input[type="number"]').val()
    axios.post(`${url}?route=signup&student=${sid}&event=${event}`)
        .then((res) => {
            data.spots = res.data.spots
            data.student = res.data.student
            data.n = res.data.n
            if (res.data.result == 400)
                throw new Error()
            $('input[name=event]').val(data.student[data.n.s['Event']])
                .removeClass('bg-danger')
                .addClass('bg-success')
            const $alert = $(
                `<div id='submitSuccess' class='alert alert-success'>
                <strong>Success!</strong> You are now signed up for ${data.student[data.n.s['Event']]}
                </div>`)
            $('button#signup').after($alert)
            console.log(res)
        }).catch((error) => {
            const $alert = $(
                `<div id='submitError' class='alert alert-danger'>
                <strong>Request Error!</strong> ${error}
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
    $("input[name=selection]").val(thisEvent).show()
}

function handleCardClick() {   
    $('.event-card').removeClass('expanded')
        .children('ul').hide()
    $(this).addClass("expanded")
        .children('ul').show()
}

function headerInds(headers) {
    var inds = {};
    for (var i = 0; i < headers.length; i++) {
        inds[headers[i]] = i;
    }
    return inds;
}