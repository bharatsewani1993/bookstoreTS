import {configurations as local} from './local';
import {configurations as development} from './development';
import {configurations as production}  from './production';
import {configurations as stage} from './stage';

export const envSettings = () => {
    switch (process.env.APP_ENV) {
        case 'local':
        return local;
        case 'dev':
        return development;
        case 'production':
        return production;
        case 'stage':
        return stage;
        default:
        return local;
    }
}
