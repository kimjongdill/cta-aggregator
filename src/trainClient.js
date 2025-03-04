const TRAIN_URL = 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx'
const STOP = '40060';
const QUERY = new URLSearchParams({
    mapid: STOP,
    key: CTA_TRAIN_KEY,
    outputType: 'json',
});

async function getTrainTimes() {
    url = `${TRAIN_URL}?${QUERY.toString()}`
    console.log(url);
    const responseRaw = await fetch(url);
    const responseParsed = await responseRaw.json();

    const formatted = responseParsed.ctatt.eta.map( x => {
        const rawTime = x.arrT.split('T')[1];
        const hms = rawTime.split(':');
        const military = `${hms[0]}:${hms[1]}`;

        return {
            destination: x.destNm,
            predictedTime: military,
            isGhost: x.isSch !== "0",
            route: x.rt,
            runNumber: x.rn,
        }
    })

    return formatted;
}

export default getTrainTimes;