$(document).ready(function () {
    db = firebase.database();

    var trainRef = db.ref('/trains');

    $(document).on('click', '#sbmt', event => {
        event.preventDefault();

        var name = $('#name-input');
        var destination = $('#destination-input');
        var time = $('#time-input');
        var frequency = $('#frequency-input');

        if (!name.val() || !destination.val() || !time.val() || !frequency.val()) {

            alert('Please fill out all fields to add a train');
            name.val('');
            destination.val('');
            time.val('');
            frequency.val('');
        }
        else {
            trainRef.push({
                name: name.val(),
                destination: destination.val(),
                time: time.val(),
                frequency: frequency.val()
            });
        }
    });

    trainRef.on('value', snap => {
        $('#current-trains').empty();

        snap.forEach(childSnap =>{
            var newTrain = $('<tr>');
            var newName = $('<td>' + childSnap.val().name + '</td>');
            var newDest = $('<td>' + childSnap.val().destination + '</td>');
            var newFreq = $('<td>' + childSnap.val().frequency + '</td>');

            newTrain.append(newName, newDest, newFreq);
            $('#current-trains').append(newTrain);
        })
    });
});