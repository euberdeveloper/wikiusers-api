import * as cors from 'cors';
import * as morgan from 'morgan';
import * as mongodb from 'mongodb';
import * as express from 'express';

async function dbQuery<T>(callback: (db: mongodb.Db) => Promise<T>): Promise<T> {
    const connection = await mongodb.MongoClient.connect('mongodb://localhost:27017');
    const db = connection.db('wikiusers');
    const result = await callback(db);
    await connection.close();
    return result;
}

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.get('/:lang/users', async (req, res) => {
    const lang = req.params.lang;
    const users = await dbQuery(async db => {
        const usersCollection = db.collection(`${lang}wiki`);
        return usersCollection.find({}).project({ activity: false, blocks: false, usernames_history: false }).limit(1000).toArray();
    });
    res.json(users);
});

app.get('/:lang/users/:id', async (req, res) => {
    const lang = req.params.lang;
    const id = +req.params.id;
    const users = await dbQuery(async db => {
        const usersCollection = db.collection(`${lang}wiki`);
        return usersCollection.findOne({ id });
    });
    res.json(users);
});

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});