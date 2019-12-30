const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../modles/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/', (req, res) =>
  Gig.findAll()
    .then(gigs => res.render('gigs', {
      gigs
    }))
    .catch(err => console.log(err)))

//Display add gig form
router.get('/add', (req, res) => res.render('add'));
// Add gigs
router.post('/add', (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  let errors = [];

  // validate fields
  if (!title) {
    errors.push({ text: 'please add a title' })
  }
  if (!technologies) {
    errors.push({ text: 'please add some technologies' })
  }
  if (!contact_email) {
    errors.push({ text: 'please add a contact email' })
  }
  if (!description) {
    errors.push({ text: 'please add a description' })
  }

  //Check for errors
  if (errors.length > 0) {
    res.render('add', {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email
    });
  } else {
    if (!budget) {
      budget = 'Unknown';
    } else {
      budget = `$${budget}`
    }

    // Make lowercase and remove space after comma
    technologies = technologies.toLowerCase().replace(/,/g, ',')
    // Insert into table
    Gig.create({
      title,
      technologies,
      description,
      budget,
      contact_email
    })
      .then(gig => res.redirect('/gigs'))
      .catch(err => console.log(err));
  }
});

// Search for gigs
router.get('/search', (req, res) => {
  let { term } = req.query;

  // Make lowercase
  term = term.toLowerCase();

  Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
    .then(gigs => res.render('gigs', { gigs }))
    .catch(err => console.log(err));
});
module.exports = router;