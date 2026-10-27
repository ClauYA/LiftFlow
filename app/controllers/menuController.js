
const Platillo = require('../models/menu');
//functions
exports.createPlatillo = async (req, res) =>{
  try{
    const data = { ...req.body };
    if (!data.image) {
      let r = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(data.title)}`);
      let json = await r.json();
      if (!json.meals) {
        r = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        json = await r.json();
      }
      data.image = json.meals?.[0]?.strMealThumb || 'img/tacos.jpg';
    }
    res.redirect('/profile');
  }catch (err){
    res.status(400).json({ error: err.message });
  }
};
exports.getAllPlatillos= async (req, res) =>{
  try {
    const menu = await Platillo.find();
    res.render('index.ejs', {menu});
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getOnePlatillo = async (req, res) => {
  try {
    const datos = await Platillo.findById(req.params.id);
    if (!datos) {return res.status(404).json({ error: 'No encontrado' });}
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePlatillo = async (req, res) => {
  try {
    const actualizado = await Platillo.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!actualizado) {return res.status(404).json({ error: 'No encontrado' });}
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePlatillo = async (req, res) => {
  try {
    const eliminado = await Platillo.findByIdAndDelete(req.params.id);
    if (!eliminado) {return res.status(404).json({ error: 'No encontrado' });}
    res.json({ mensaje: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
