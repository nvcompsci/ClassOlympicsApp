let events = [
    {'name':'Volleyball',
     'spots':{'9':10,'10':10,'11':10,'12':10}},
    {'name':'Basketball',
    'spots':{'9':10,'10':10,'11':10,'12':10}}]

$('div#events-container').append(events.map((event) => 
    $(`<div id='${event.name}' class='event-card card'>
        <h1>${event.name}</h1>
        <ul>
            <li>9th: ${event.spots['9']}</li>
        </ul>
    </div>`)
))

axios.post('https://script.google.com/macros/s/AKfycbwFPH7SSqFZ3Tn-nDR4DGlkzGMJK0KnRSXlO7wY2QTgfqapdoc/exec')
    .then((res) => {
        console.log(res)
        $('body').append(res)
    }).catch((error) => {
        console.error(error)
    })

