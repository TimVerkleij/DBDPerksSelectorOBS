const channel = 'blastbucketgaming'
const obs = new OBSWebSocket()

const URL = '192.168.1.127'
const PORT = 4455
const password = '3NseeLRhNBBqNJcS'

async function connectToOBS() {
    try {
        await obs.connect(`ws://${URL}:${PORT}`, password)
        console.log(`Success! We're connected & authenticated.`)
    } catch (err) {
        console.log(err)
    }

}

function heartbeat() {
    ws.send("PING")
}


function connect() {
    var heartbeatInterval = 1000 * 15; //ms between PING's
    var reconnectInterval = 1000 * 3; //ms to wait before reconnect
    var heartbeatHandle;

    ws = new WebSocket('wss://irc-ws.chat.twitch.tv/')

    ws.onopen = function (event) {
        heartbeat()
        heartbeatHandle = setInterval(heartbeat, heartbeatInterval);
        ws.send('PASS SCHMOOPIIE')
        ws.send('NICK justinfan32006')
        ws.send('USER justinfan32006 8 * :justinfan32006')
        ws.send(`JOIN #${channel}`)
    };

    ws.onerror = function (error) {
        console.error('An error occured')
    };

    ws.onmessage = function (event) {
        eventData = event.data
        const message = eventData.split(' ')
        if (message[0] === "PONG") {
            return
        } else if (message[3] === "{TYPE: PING}") {
            ws.send("PONG")
            return
        } else {
            const userMessage = eventData.split(':')[2].toLowerCase()

            if(userMessage.startsWith("perk 1")) {
                const baseURL = 'https://assets.nightlight.gg/img/perks/'
                const perk = getPerk(userMessage.replace("perk 1", ""))
                document.getElementById(`perk1`).src = baseURL + perk.img + '.png'
            } else if(userMessage.startsWith("perk 2")) {
                const baseURL = 'https://assets.nightlight.gg/img/perks/'
                const perk = getPerk(userMessage.replace("perk 2", ""))
                document.getElementById(`perk2`).src = baseURL + perk.img + '.png'
            } else if(userMessage.startsWith("perk 3")) {
                const baseURL = 'https://assets.nightlight.gg/img/perks/'
                const perk = getPerk(userMessage.replace("perk 3", ""))
                document.getElementById(`perk3`).src = baseURL + perk.img + '.png'
            } else if(userMessage.startsWith("perk 4")) {
                const baseURL = 'https://assets.nightlight.gg/img/perks/'
                const perk = getPerk(userMessage.replace("perk 4", ""))
                document.getElementById(`perk4`).src = baseURL + perk.img + '.png'
            }

            console.log(message)
            if(userMessage.startsWith("!resetperks") && message[0].split("!")[0] === `:${channel}}`) {
                resetPerks()
            }
        }

    };

    ws.onclose = function () {
        console.info('CLOSED')
        connect()
        clearInterval(heartbeatHandle);
    };

}

function resetPerks() {
    document.getElementById(`perk1`).src = ""
    document.getElementById(`perk2`).src = ""
    document.getElementById(`perk3`).src = ""
    document.getElementById(`perk4`).src = ""
}

resetPerks()


function getPerk(perkName) {
    const possiblePerks = []
    perks.forEach(perk => {
        let currentPerk = perk.name
        if(perk.name.startsWith("Scourge Hook: ")) {
            currentPerk = perk.name.replace("Scourge Hook: ", "")
        } else if (perk.name.startsWith("Hex:")) {
            currentPerk = perk.name.replace("Hex: ", "")
        }
        const result = trigramIndex([perkName, currentPerk])
        if(result > 50) {
            possiblePerks.push({
                name: perk.name,
                match: result,
                img: perk.img
            })
        }

    })

    if(possiblePerks.length === 1) {
        return {
            name: possiblePerks[0].name,
            match: possiblePerks[0].match,
            img: possiblePerks[0].img
        }
    } else {
        possiblePerks.sort((a, b) => b.match - a.match)
        return {
            name: possiblePerks[0].name,
            match: possiblePerks[0].match,
            img: possiblePerks[0].img
        }
    }
}

function trigramIndex(inputPhrases) {
    //Modify strings with suffix and prefix
    inputPhrases = inputPhrases.map(phrase => ("  ".concat(phrase, "  ")).toLowerCase())

    //create trigrams
    let trigrams = []
    inputPhrases.forEach(phrase => {
        let trigram = []
        for (var i = phrase.length - 3; i >= 0; i = i - 1) {
            trigram.push(phrase.slice(i, i + 3))
        }
        trigrams.push(trigram)
    })

    //compare trigrams
    let numberOfMatches = 0
    trigrams[0].forEach(trigram => {
        if (trigrams[1].includes(trigram)) {
            numberOfMatches++
        }
    })

    return parseInt(numberOfMatches / trigrams[1].length * 100)
}

connectToOBS()
connect()