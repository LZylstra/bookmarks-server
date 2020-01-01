const express = require('express')
const uuid = require('uuid/v4')
const bookmarkRouter = express.Router()
const bodyParser = express.json()
const logger = require('../logger')
const store = require('../store')

bookmarkRouter
  .route('/')
  .get((req, res) => {
    res.json(store.bookmarks);
  })
  .post(bodyParser, (req, res) => {
        const { title, url, description, rating } = req.body;
        if (!title) {
            logger.error(`Title is required`);
            return res
              .status(400)
              .send('Invalid data');
          }
          
          if (!url) {
            logger.error(`URL is required`);
            return res
              .status(400)
              .send('Invalid data');
          }
    
          // get an id
        const id = uuid();
    
        const bookmark = {
        id,
        title,
        url,
        description,
        rating
        };
    
        store.bookmarks.push(bookmark);
    
        logger.info(`Bookmark with id ${id} created`);
    
        res
        .status(201)
        .location(`http://localhost:8000/card/${id}`)
        .json(bookmark);
    });

bookmarkRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = store.bookmarks.find(c => c.id == id);
  
    // make sure we found a card
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
  
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
  
    const bookmarkIndex = store.bookmarks.findIndex(c => c.id == id);
  
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }
  
    store.bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`Bookmark with id ${id} deleted.`);
  
    res
      .status(204)
      .end();
  })

module.exports = bookmarkRouter;