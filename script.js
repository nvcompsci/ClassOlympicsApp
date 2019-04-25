let events = [
    {'name':'Volleyball',
     'spots':{'9':10,'10':10,'11':10,'12':10}},
    {'name':'Basketball',
    'spots':{'9':10,'10':10,'11':10,'12':10}}]
function createEventCards(events) {
return events.map((event) => 
    $(`<div id='${event[0]}' class='event-card card'>
        <h3>${event[0]}</h3>
        <ul>
            ${event.map(bit => `<li>${bit}</li>`).join('')}
        </ul>
    </div>`)
)
}

axios.post('https://script.google.com/macros/s/AKfycbwFPH7SSqFZ3Tn-nDR4DGlkzGMJK0KnRSXlO7wY2QTgfqapdoc/exec')
    .then((res) => {
        console.log(res)
        $('.container').append(createEventCards(res.data))
    }).catch((error) => {
        console.error(error)
    })

