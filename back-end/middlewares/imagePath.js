function setImagePath(req, res, next) {
    req.imagePath = `${req.protocol}://${req.get('host')}/`
    next();
  }
  
  export default setImagePath;