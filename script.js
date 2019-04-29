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
    $('#events-container').append(createEventCards(res.data.events))
    $('div.event-card button').click(handleButtonClick)
    $('div.event-card').hover(mouseEnterCard, mouseLeaveCard)
}).catch((error) => {
    document.append(error);
    console.error(error)
})

function createEventCards(events) {
return events.map((event) => 
    $(`<div id='${event[h.name]}' class='event-card card'>
        <h6>${event[h.name]}</h6>
        <ul>
            <li>${event[h.desc]}</li>
            <li>${event[h.location]}</li>
            <li>${event[h.teachers]}</li>
            <li>${event[h.spots]}</li>
        </ul>
        <button type=button class='btn btn-primary'>Select</button>
    </div>`)
)
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
            $('select').val(res.data.student[data.n.s['Event']])
            $('.hideAtStart').show()
            $('#events-container').empty().append(createEventCards(data.events))
            $('div.event-card button').click(handleButtonClick)
        }).catch((error) => {
            console.error(error)
        })
})

$("button#signup").click(e => {
    e.preventDefault()
    const event = $('select').val()
    const sid = $('input[type="number"]').val()
    axios.post(`${url}?route=signup&student=${sid}&event=${event}`)
        .then((res) => {
            data.spots = res.data.spots
            data.student = res.data.student
            data.n = res.data.n
            console.log(res)
        }).catch((error) => {
            console.error(error)
        })
})

function handleButtonClick(e) {
    let thisElem = $(e.target)
    thisElem.toggleClass('btn-primary').toggleClass('btn-success')
    let thisEvent = thisElem.siblings('h6').text();
    $("select").val(thisEvent).show()
}

function mouseEnterCard() {
    $(this).children('ul').toggle()
    $(this).css("width","45%")
}

function mouseLeaveCard() {
    $(this).children('ul').toggle()
    $(this).css("width","22%")
}

function headerInds(headers) {
    var inds = {};
    for (var i = 0; i < headers.length; i++) {
        inds[headers[i]] = i;
    }
    return inds;
}