const url = 'https://script.google.com/macros/s/AKfycbwFPH7SSqFZ3Tn-nDR4DGlkzGMJK0KnRSXlO7wY2QTgfqapdoc/exec'

const h = {
    'name':0,
    'teachers':2,
    'spots':3,
    'location':5,
    'desc':7
}
function createEventCards(events) {
return events.map((event) => 
    $(`<div id='${event[h.name]}' class='event-card card'>
        <h3>${event[h.name]}</h3>
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

$("input[type='submit']").click(e => {
    e.preventDefault()
    const sid = $('input[type="number"]').val()
    axios.post(url)
        .then((res) => {
            console.log(res)
            $('.container').append(createEventCards(res.data))
            $('div.event-card button').click(function() {$(this).toggleClass('btn-primary').toggleClass('btn-success')})
        }).catch((error) => {
            document.write(error);
            console.error(error)
    })
})

function headerInds(headers) {
    var inds = {};
    for (var i = 0; i < headers.length; i++) {
        inds[headers[i]] = i;
    }
    return inds;
}