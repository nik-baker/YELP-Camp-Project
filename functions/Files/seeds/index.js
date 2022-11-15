const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // Master User ID 
            author: "636befb8ce58334690984b4b",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur eveniet obcaecati maxime veritatis minima harum cumque accusamus excepturi! Aperiam quisquam nisi a sint, corrupti aspernatur dolorum ipsam repellat dolores in. Et fuga doloribus perspiciatis! Unde atque quisquam voluptates facilis ratione corporis ipsam eum libero dignissimos.Voluptas inventore praesentium iusto tempore enim, sunt, alias voluptates eveniet sint, debitis cum quos consequuntur.",
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            price: price,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})