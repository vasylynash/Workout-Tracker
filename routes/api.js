const router = require('express').Router();
const Workout = require('../models/Workout');

router.get('/api/workouts', async (req, res) => {
    try{
        
        const workoutData = await Workout.aggregate([
            {$addFields: {
                totalDuration: {$sum: '$exercises.duration'}
            }}
        ]);
        res.json(workoutData);

    }
    catch (error) {
        res.json(error)
    }
});

router.post('/api/workouts', async (req, res) => {
    try {
        const workout = await Workout.create(req.body);
        res.json(workout);
    } catch (error) {
        res.json(error)
    }
});

router.put('/api/workouts/:id', async (req, res) => {
    try {
        const workoutData = await Workout.updateOne({
            _id: req.params.id,
        },
        {
            $inc: { totalDuration: req.body.duration },
            $push: { exercises: req.body }
        },
        { new: true });
        res.json(workoutData);
    }
    catch (error) {
        res.json(error)
    }
});

router.get('/api/workouts/range', async (req, res) => {
    try {
        const workouts = await Workout.aggregate([
            {$addFields: {
                totalDuration: {$sum: '$exercises.duration'}
            }}
        ]).sort({date: -1}).limit(7);
       console.log(workouts);
       res.json(workouts) 
    } catch (error) {
        res.json(error)
    }
});



module.exports = router;