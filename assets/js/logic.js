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
        let rows = $('.removable');

        rows.toArray().forEach(row => row.remove());

        snap.forEach(childSnap => {
            populateTrainData(childSnap);
        });
    });

    function populateTrainData(childSnap) {
        var newTrain = $('<tr class="removeable">');
        var newName = $('<td>' + childSnap.val().name + '</td>');
        var newDest = $('<td>' + childSnap.val().destination + '</td>');
        var newFreq = $('<td>' + childSnap.val().frequency + '</td>');

        newTime = parseTime(childSnap.val().time);
        newTime = calcNextTrain(newTime, childSnap.val().frequency);

        let newDate = new Date(newTime.time);
        let h = formatHours(newDate.getHours());
        let m = formatMinutes(newDate.getMinutes());

        let nextArrivalString = (h + ':' + m);

        var nextArrival = $('<td id="next-arrival">' + nextArrivalString + '</td>');
        var minsAway = $('<td id="mins-away">' + newTime.minsAway + '</td>');

        newTrain.append(newName, newDest, newFreq, nextArrival, minsAway);
        $('#current-trains').append(newTrain);
    };

    function parseTime(time) {
        let d = new Date();
        let yr = d.getFullYear();
        let mo;
        let dy;

        if ((d.getMonth() + 1) < 10)
            mo = '0' + (d.getMonth() + 1);
        else
            mo = d.getMonth() + 1;

        if (d.getDate() < 10)
            dy = '0' + d.getDate();
        else
            dy = d.getDate();
        let str = yr + '-' + mo + '-' + dy + 'T' + time + ':00';

        let t = new Date(str);

        return t;
    }

    function formatHours(hours) {
        if (hours < 10)
            return '0' + hours;
        else
            return hours;
    };
    function formatMinutes(minutes) {
        if (minutes < 10)
            return '0' + minutes;
        else
            return minutes;
    };

    function calcNextTrain(date, frequency) {
        let d = new Date();
        let newDate = new Date(date);
        if (newDate > d) {
            let mins = Math.ceil((date - d) / 1000 / 60);
            return { time: date, minsAway: mins };
        }
        else {
            while (newDate < d) {
                newDate = new Date(newDate.getTime() + (frequency * 1000 * 60));
            }

            let mins = Math.ceil((newDate - d) / 1000 / 60);
            return { time: newDate, minsAway: mins };
        }
    }




});