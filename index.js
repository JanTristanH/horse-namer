import fetch from 'node-fetch';
import { resolve } from 'path';
const config = {
    sourceLanguageCode: "de",
    sourceStartingWords: [
        "Überraschung",
        "Verblüffung",
        "Zufall",
        "Erstaunen",
        "Geschenk",
        "Überrumpelung",
        "Verwunderung"],
    desiredStartingString: "M",
    //hostUrl: "https://libretranslate.com"
    hostUrl: "http://localhost:5000"
}

let getTranslation = (source, target, str) => {
    return new Promise(async (resolve, rej) => {
        const res = await fetch(config.hostUrl + "/translate", {
            method: "POST",
            body: JSON.stringify({
                q: str,
                source: source,
                target: target,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });
        let result = await res.json();
        result.source = source;
        result.target = target;
        result.originalText = str;
        if (result.error) rej(res);
        resolve(result);
    });
}

let getAllLanguages = async () => {
    const res = await fetch(config.hostUrl + "/languages");
    return await res.json();
}

let generateResult = (config, languages) => {
    console.debug(languages);
    let res = [];
    for (let currStr of config.sourceStartingWords) {
        Promise.all(languages.map(l => getTranslation(config.sourceLanguageCode, l.code, currStr)))
            .then(r => {
                //console.debug(r);
                let filtered = r.filter(s => {
                    debugger
                    return s.translatedText.toLowerCase().startsWith(config.desiredStartingString.toLowerCase())
                });
                console.log("--------------------------------------------------");
                console.log(filtered);
            })
    }
    return res;
}

(async () => generateResult(config, await getAllLanguages()))();