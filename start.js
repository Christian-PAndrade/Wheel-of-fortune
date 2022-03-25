$(document).ready(() => {
    let players = [
        {
            id: player1,
            name: "",
            currentlyPlaying: true,
            points: 0
        },
        {
            id: player2,
            name: "",
            currentlyPlaying: false,
            points: 0
        },
        {
            id: player3,
            name: "",
            currentlyPlaying: false,
            points: 0
        }
    ]

    // new word
    $("#newWordBtn").click(() => {
        const newSentence = $("#newWord").val();
        $("#newWord").val("");
        const length = newSentence.length;
        const isOdd = length % 2 !== 0;
        resetBoard();
        
        if (newSentence.length <= 12) {
            const row = $(".row:eq(1)");
            const tiles = row.children("div.nullTile");

            fillRow(tiles, isOdd, newSentence);
        } else {
            const wordsPerRow = decideWhereToCutString(newSentence);
            let rowOnePos = ".row:eq(1)", rowTwoPos = ".row:eq(2)"

            if (newSentence.length >= 24) {
                const row3 = $(".row:eq(2)");
                const tiles3 = row3.children("div.nullTile");
                const joinedWords3 = wordsPerRow.tRowWords.join(" ");
                fillRow(tiles3, joinedWords3.length % 2 !== 0, joinedWords3);

                // makes row 1 become 0 and row 2 become 1
                rowOnePos = ".row:eq(0)";
                rowTwoPos = ".row:eq(1)";
            }

            const row1 = $(rowOnePos);
            const tiles1 = row1.children("div.nullTile");
            const joinedWords1 = wordsPerRow.fRowWords.join(" ");
            fillRow(tiles1, joinedWords1.length % 2 !== 0, joinedWords1);

            const row2 = $(rowTwoPos);
            const tiles2 = row2.children("div.nullTile");
            const joinedWords2 = wordsPerRow.sRowWords.join(" ");
            fillRow(tiles2, joinedWords2.length % 2 !== 0, joinedWords2);
        }
    });

    const fillRow = (tiles, isOdd, sentence) => {
        let startingPoint = 7 - (parseInt(sentence.length / 2));
        if (isOdd) {
            startingPoint -= 1; // minus one to center left
        }

        console.log({sentence, isOdd, startingPoint})
        for (let i = startingPoint; i < sentence.length + startingPoint; i++) {
            tile = $(tiles[i]);

            // if space skip
            if (sentence[i - startingPoint] !== " ") {
                tile.attr("data-letter", sentence[i - startingPoint].toUpperCase());
                tile.addClass("blankLetter")
            }
        }
    };

    const decideWhereToCutString = sentence => {
        // find spaces... we ain't doing words longer than twelve letters
        const words = sentence.split(" ");

        // see how many words fit until we reach twelve... always adding 1 per word to account for spaces
        let tileCounter = 0, secondLineIndex, thirdLineIndex;
        for (let i = 0; i < words.length; i++) {
            const wordLength = words[i].length
            console.log({wordLength, tileCounter, secondLineIndex, sum: tileCounter + wordLength + 1})
            if (tileCounter + wordLength + 1 >= 14 && !secondLineIndex) {
                secondLineIndex = i;
                //tileCounter += wordLength + 1;
                tileCounter = wordLength + 1;
            } else if (tileCounter + wordLength + 1 >= 14 && secondLineIndex) {
                thirdLineIndex = i
                break;
            } else {
                tileCounter += wordLength + 1;
            }
        }
        console.log(secondLineIndex, thirdLineIndex)
        return {
            fRowWords: words.slice(0, secondLineIndex),
            sRowWords: words.slice(secondLineIndex, thirdLineIndex),
            tRowWords: words.slice(thirdLineIndex)
        }
    }
    
    // handles user guess
    $("#userInputBtn").click(function(e) {
        const guess = $("#userInput").val().toUpperCase();

        // reveal if any letters match
        let count = 0;
        $(".blankLetter").map(function(_, blank) {
            const cell = $(blank);
            console.log({cell, cellLetter: cell.attr("data-letter"), guess})
            if (cell.attr("data-letter") === guess) {
                $(this).addClass("guessnotTurnedLetter"); 
                $(this).removeClass("blankLetter");

                $(this).click(() => revealLetter($(this)));
                count++;
            }
        });

        $("#userInput").val("");
        $("#userGuessedLetter").val(guess);
        $("#userGuessedLetterNumber").val(count);
    })

    $(".guessnotTurnedLetter").click(function(e) {
        revealLetter($(this))
    });

    const revealLetter = (cell) => {
        cell.removeClass("guessnotTurnedLetter");
        cell.text(cell.attr("data-letter"))
        cell.addClass("guessedLetter");
    };

    const resetBoard = () => {
        $(".guessedLetter").text("");
        $("div[data-letter]").removeAttr("data-letter");
        $(".blankLetter").removeClass("blankLetter");
        $(".guessedLetter").removeClass("guessedLetter");
        $(".guessnotTurnedLetter").removeClass("guessnotTurnedLetter");
    }
})