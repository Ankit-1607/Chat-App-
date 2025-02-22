const notFound = (req, res) => res.status(404).send('<h1>Oops!! Page you are for looking does not exist</h1>')

module.exports = notFound