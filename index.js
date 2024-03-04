import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function create(movies) {
  try {
    const database = client.db("sample_mflix");
    const collection = database.collection("movies");

    await collection.insertMany(movies);

    console.log("Movie created successfully.");
  } catch (err) {
    console.error("Error creating movie", err);
  } finally {
    await client.close();
  }
}

const read = async (filters) => {
  try {
    const database = client.db("sample_mflix");
    const collection = database.collection("movies");

    const query = filters || {};

    const movies = await collection.findOne(query);

    console.log(JSON.stringify(movies));
  } catch (error) {
    console.error("Error reading movie", error);
  } finally {
    await client.close();
  }
};

async function update(filters, value) {
  try {
    const database = client.db("sample_mflix");
    const collection = database.collection("movies");

    const query = filters || {};
    const newValue = {
      $set: {
        plot: value,
      },
    };

    const movies = await collection.updateOne(query, newValue);
    console.log(movies);
  } catch (error) {
    console.error("Error updating movie", error);
  } finally {
    await client.close();
  }
}

async function deleteMovie(movie) {
  try {
    const database = client.db("sample_mflix");
    const collection = database.collection("movies");

    const query = movie || {};
    const movies = await collection.deleteOne(query);
    console.log(movies);
  } catch (error) {
    console.error("Error deleting movie", error);
  } finally {
    await client.close();
  }
}

const moviesDocuments = [
  {
    title: "The Godfather",
    year: 1972,
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  },
  {
    title: "The Dark Knight",
    year: 2008,
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
];

create(moviesDocuments);
read(moviesDocuments);
update(
  { title: "The Dark Knight" },
  "The Dark Knight is a 2008 superhero film directed, produced, and co-written by Christopher Nolan."
);
deleteMovie({ title: "The Dark Knight" });
