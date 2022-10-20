import getBusTimes from './busClient';
import getTrainTimes from './trainClient';

async function transitAggregator(){
    
    const requests = [getBusTimes(), getTrainTimes()];
    const [busTimes, trainTimes] = await Promise.all(requests);
    
    const times = {
        bus: busTimes,
        train: trainTimes,
    }
    
    return times;
}

export default transitAggregator;