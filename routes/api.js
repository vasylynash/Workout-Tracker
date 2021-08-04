const router = require('express').Router();
const Workout = require('../models/Workout');

router.get('/api/workouts', async (req, res) => {
    try{
        const workoutData = await Workout.find({}).sort({date: -1});
        console.log("Workout get: " + workoutData);
        workoutData.forEach(workout => {
            let total = 0;
            workout.exercises.forEach(exercise => {
                total += exercise.duration;
            });
            workout.duration = total;
        })
        res.json(workoutData);

    }
    catch (error) {
        res.json(error)
    }
});

router.post('/api/workouts', async (req, res) => {
    try {
        console.log("req.body: " + req.body);
        const workout = await Workout.create(req.body);
        console.log("Workout: " + workout);
        res.json(workout);
    } catch (error) {
        res.json(error)
    }
});

router.put('/api/workouts/:id', async (req, res) => {
    try {
        const workoutData = await Workout.updateOne({
            id: req.params.id,
        },
        {
            $inc: { duration: req.body.duration },
            $push: { exercises: req.body }
        },
        { new: true });
        console.log(workoutData);
        res.json(workoutData);
    }
    catch (error) {
        res.json(error)
    }
});



module.exports = router;