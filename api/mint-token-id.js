module.exports = async (req, res) => {
    const { query: { data } } = req
    console.log(req)
    res.json(req)
}