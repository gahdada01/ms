var express = require('express');
var router = express.Router();
var qr_image = require('qr-image');
var qrcode = require('qrcode');

router.get('/', (req, res, next) => {
   console.log("richard");

    qrcode.toCanvas('RICHARD', { errorCorrectionLevel: 'H' }, (err, result) => {
        console.log(result);
        console.log(err);
    });

});

router.get('/qr/:text', function(req,res) {
    var code = qr_image.image(req.params.text, { type: 'png', ec_level: 'M', size: 10 });
    res.setHeader('Content-type', 'image/png');
    code.pipe(res);
});

module.exports = router;