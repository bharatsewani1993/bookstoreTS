import  {Request} from 'express';

const getBody = (req:Request) => {
    if(req.method === 'GET') {
        return req.query;
    } else { 
        return req.body;
    }
}

export{getBody}