module.exports = async (req, res) => {
    const { query: { data } } = req
    console.log(data)
    res.json(data)
}