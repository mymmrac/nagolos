let time;

$(document).ready(function () {
    let words;
    let ind = 0;
    let corr = 0;

    let ansField = $("#ans");

    let ansBtn = $("#ans-btn");
    let ansText = $("#ans-text");
    let ansWait = $("#ans-wait");
    let wordText = $("#word");

    let wordCount = $("#word-number");
    let wordCorr = $("#correct-count");
    let wordPers = $("#correct-percent");

    let ng = ['а', 'о', 'і', 'у', 'е', 'и', 'я', 'є', 'ї', 'ю'];

    $.get('words.csv', function (data) {
        let w = csvArray(data);
        console.log("Words count:", w.length);
        words = shuffle(shuffle(shuffle(w).concat(w)).concat(w));
        wordText.html(words[0].word);
        wordCount.text("1");
        wordCorr.text("0");
        wordPers.text("0");
    }, "text");


    $("#quiz").submit(function (e) {
        e.preventDefault();

        let ans = parseInt(ansField.val())
        ansField.val("");

        ansBtn.prop('disabled', true);
        ansText.hide();
        ansWait.show();

        setTimeout(function () {
            ansBtn.prop('disabled', false);
            ansWait.hide();
            ansText.show();

            ind++;
            wordText.html(words[ind].word);
        }, time);

        let l = 0;
        for (let i = 0; i < words[ind].word.length; i++) {
            let c = words[ind].word.charAt(i);
            if (ng.includes(c.toLowerCase())) {
                l++;
            }
            if (l === words[ind].num) {
                let w1 = words[ind].word.substring(0, i);
                let w2 = words[ind].word.substring(i + 1);
                let color = "red";
                if (words[ind].num === ans) {
                    corr++;
                    color = "lime";
                }
                let w = w1 + "<span style=\"color: " + color + "\">" + c + "</span>" + w2;
                wordText.html(w);
                break;
            }
        }

        wordCount.text(ind + 1);
        wordCorr.text(corr);
        wordPers.text(((corr / (ind + 1).toFixed(1)) * 100).toFixed(2));

    })

    changeFontSize();
    changeTime();

    function changeFontSize() {
        let fontSize = getCookie("font-size");
        if (fontSize === "") {
            setCookie("font-size", "4");
            fontSize = "4";
        }

        $("#font-size").val(fontSize);
        $("#font-output").val(fontSize);
        $(".word").css("font-size", fontSize + "rem");
    }

    function changeTime() {
        let timeSettings = getCookie("time");
        if (timeSettings === "") {
            setCookie("time", "2");
            timeSettings = "2";
        }
        timeSettings = parseFloat(timeSettings);

        $("#time").val(timeSettings);
        $("#time-output").val(timeSettings);
        time = timeSettings * 1000;
    }

    $("#save-settings").click(function () {
        $("#settings-modal").modal('hide');

        let fontSize = $("#font-size").val();
        setCookie("font-size", fontSize);
        changeFontSize();

        let timeSettings = $("#time").val();
        setCookie("time", timeSettings);
        changeTime();
    })
})

function updateFont() {
    $("#font-output").val($("#font-size").val());
}

function updateTime() {
    $("#time-output").val($("#time").val());
}

function csvArray(csv) {
    let lines = csv.split("\n");
    let result = [];

    for (let i = 0; i < lines.length; i++) {
        let obj = {};
        let currentLine = lines[i].split(",");
        if (currentLine.length === 2) {
            obj["word"] = currentLine[0]
            obj["num"] = parseInt(currentLine[1]);
            result.push(obj);
        }
    }
    return result;
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function setCookie(cName, cValue, exdays = 30) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cName + "=" + cValue + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(cName) {
    let name = cName + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}