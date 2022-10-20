const BUS_URL = 'http://www.ctabustracker.com/bustime/api/v2/getpredictions';
const STOPS = ['17479', '7862'];
const QUERY = new URLSearchParams({
    key: CTA_BUS_KEY,
    stpid: STOPS.join(','),
    format: 'json'
});

async function getBusTimes() {
    url = `${BUS_URL}?${QUERY.toString()}`
    console.log(url);
    const responseRaw = await fetch(url);
    const responseParsed = await responseRaw.json()
    
    const formatted = responseParsed['bustime-response']['prd'].map( x => {
        return {
            route: x.rt,
            destination: x.des,
            direction: x.rtdir,
            predictedTime: x.prdtm.split(' ')[1],
        };
    })

    return formatted;
}

export default getBusTimes;