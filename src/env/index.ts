import local from './local';
import development from './development';
import production from './production';
import stage from './stage';

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
