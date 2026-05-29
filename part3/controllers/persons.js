import express from "express";
import jwt from "jsonwebtoken";
import Person from "../models/person.js";
import User from "../models/user.js";

const personsRouter = express.Router();

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

personsRouter.get("/", async (req, res) => {
  const persons = await Person.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(persons);
});

personsRouter.get("/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id).populate("user", {
      username: 1,
      name: 1,
    });
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

personsRouter.post("/", async (req, res, next) => {
  try {
    const { name, number} = req.body;

    if (!name || !number) { 
      return res.status(400).json({
        error: "name or number missing",
      });
    }

    

    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({
        error: "user not found",
      });
    }
    
    const person = new Person({
      name,
      number,
      user: user._id,
    });

    const savedPerson = await person.save();

    user.persons = user.persons.concat(savedPerson._id);

    await user.save();

    res.status(201).json(savedPerson);
  } catch (error) {
    next(error);
  }
});

personsRouter.delete("/:id", async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

personsRouter.put("/:id", async (req, res, next) => {
  try {
    const { name, number } = req.body;

    const person = {
      name,
      number,
    };

    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      person,
      {
        new: true,
        runValidators: true,
        context: "query",
      },
    );

    res.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

export default personsRouter;
