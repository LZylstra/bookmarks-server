const BookmarksService = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmarks')
    },
    getBookmarkById(knex, bookmarksid) {
        return knex.from('bookmarks').select('*').where('id', bookmarksid).first()
    },
}

module.exports = BookmarksService