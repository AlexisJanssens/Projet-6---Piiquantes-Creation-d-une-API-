// imports
const Sauce = require('../models/Sauce');
const fs = require('fs');
const { json } = require('express');

// display all sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => { 
        res.status(200).json(sauces);
    })
    .catch((error) => {
        res.status(400).json({ error: error })
    });
};

// create a sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });

    sauce.save()
    .then(() => { 
        res.status(201).json({message: 'Objet enregistré !'})
    })
    .catch(error => { 
        res.status(400).json({ error })
    });
};

// get one specific sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        res.status(200).json(sauce)
    })
    .catch(error => { 
        res.status(404).json({ error })
    });
};

// delete a specific sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.stats(401).json({ message : 'Non-autorisé' })
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({_id: req.params.id})
                .then(() => {
                    res.status(200).json({ message : 'Sauce supprimée'})
                })
                .catch( error => {
                    res.status(401).json({ error })
                } )
            })
        }
    })
    .catch( error => res.status(500).json({ message: error }))
}

// modify a specific sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    } : {
        ...req.body
    };    
    delete sauceObject.userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized' })
            } else {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message : 'Sauce modifiée' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
}

// like or dislike a sauce
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then ((sauce) => {
            if (req.body.like === 1) {
                res.status(200).json({ message : 'Sauce likée' });
                sauce.likes += 1;
                sauce.usersLiked.push(req.body.userId); 
                sauce.save();
            } else if (req.body.like === 0) {
                const userIndexLike = sauce.usersLiked.indexOf(req.body.userId);
                const userIndexDislike = sauce.usersDisliked.indexOf(req.body.userId);
                if (userIndexLike !== -1) {
                    sauce.usersLiked.splice(userIndexLike, 1);
                    sauce.likes -= 1;
                    sauce.save();
                    res.status(200).json({ message : 'Sauce délikée' });    
                }
                if (userIndexDislike !== -1) {
                    sauce.usersDisliked.splice(userIndexDislike, 1);
                    sauce.dislikes -= 1
                    sauce.save();
                    res.status(200).json({ message : 'Sauce dédislikée' });
                }
            } else if (req.body.like === -1) {
                sauce.dislikes += 1;
                sauce.usersDisliked.push(req.body.userId); 
                sauce.save();
                res.status(200).json({ message : 'Sauce dislikée' });
            }
        })
        .catch (error => res.status(401).json({ error }));
}