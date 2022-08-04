const mongoose = require('mongoose');
const Producer = require('./models/producer');

const url = 'mongodb://localhost:27017/pommeauserver';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => {

    console.log('Connected correctly to the server');

    Producer.create({ 
        name: 'Test Producer 1',
        description: 'Test description'
    })
    .then(producer => {
        console.log(producer);

        return Producer.findByIdAndUpdate(producer._id, {
            $set: { description: 'Updated Test document'}
        }, {
            new: true
        });
    })
    .then(producer => {
        console.log(producer);

        producer.comments.push({
            rating: 5,
            text: 'test description test',
            author: 'Test Testington'
        });

        return producer.save();
    })
    .then(producer => {
        console.log(producer);
        return Producer.deleteMany();
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch(err => {
        console.log(err);
        mongoose.connection.close();
    });
});