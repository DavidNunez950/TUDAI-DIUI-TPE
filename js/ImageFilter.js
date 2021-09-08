export { ImageFilter };

"use strict";

const ImageFilter = {
    grayScale  : function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.grayScaleFilter, intensity)
    },
    saturation : function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.saturationFilter, intensity)
    },
    blur       : function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.blurFilter, intensity)
    },
    invertImage: function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.invertImageFilter, intensity)
    },
    invertColorImage: function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.invertColorImageFilter, intensity)
    },
    sobelX: function(inputImage, outputImage) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.sobelFilter)
    }
}

const imageFilterApplicator = {

    aplyFilter: function(inputImage, outputImage, imageFilter, intensity = 0) {
        intensity = ((intensity/100) * imageFilter.maxIntensity) + imageFilter.minIntensity; 
        intensity = imageFilter.correctIntensity(intensity);
        for (let y = 0; y < inputImage.height; y++) {
            for (let x = 0; x < inputImage.width; x++) {
                let [r, g, b] = imageFilter.filter(inputImage, x, y, intensity);
                this.setPixel(outputImage, x, y, r, g, b);
            }          
        }
        return outputImage;
    },
    
    setPixel: function(imagenData, x, y, r, g, b, a = 255) {
        let index = (x + y * imagenData.width) * 4;
        imagenData.data[index + 0] = r;
        imagenData.data[index + 1] = g;
        imagenData.data[index + 2] = b;
        imagenData.data[index + 3] = a;
    }
}


// Discutir una mejor implementación(clases, objetos, reemplazar las clases por parametros)
const ImageFilterInterface = {
    maxIntensity: 0,
    minIntensity: 0,
    intensity: 0,
    filter: function(imagenData, intensity) {},
    correctIntensity: function(intensity) {
        intensity = (intensity > this.maxIntensity) ? this.maxIntensity : intensity;
        intensity = (intensity < this.minIntensity) ? this.minIntensity : intensity;
        return intensity;
    }
}

// Image Invert Filter
const invertColorImageFilter = {...ImageFilterInterface};
invertColorImageFilter.maxIntensity = 100;
invertColorImageFilter.minIntensity = 0;
invertColorImageFilter.filter = function(imagenData, x, y, intensity) {
    let index = (x + y * imagenData.width) * 4;
    let r = imagenData.data[index + 0] + ((255 - imagenData.data[index + 0]*2)/100) * intensity ;
    let g = imagenData.data[index + 1] + ((255 - imagenData.data[index + 1]*2)/100) * intensity ;
    let b = imagenData.data[index + 2] + ((255 - imagenData.data[index + 2]*2)/100) * intensity ;
    return [r, g, b];
};

// Image Invert Filter
const invertImageFilter = {...ImageFilterInterface};
invertImageFilter.maxIntensity = 0.0;
invertImageFilter.minIntensity = 0.1;
invertImageFilter.filter = function(imagenData, x, y) {
    x = imagenData.width  - 1 - x;
    y = imagenData.height - 1 - y;
    let index = (x + y * imagenData.width) * 4;
    let r = imagenData.data[index + 0];
    let g = imagenData.data[index + 1];
    let b = imagenData.data[index + 2];
    return [r, g, b];
};

// Gray Sacle Filter
const grayScaleFilter = {...ImageFilterInterface};
grayScaleFilter.maxIntensity = 1;
grayScaleFilter.minIntensity = 0.1;
grayScaleFilter.filter = function (imagenData, x, y, intensity = 0) {
    let index = (x + y * imagenData.width) * 4;
    let r = imagenData.data[index + 0];
    let g = imagenData.data[index + 1];
    let b = imagenData.data[index + 2];
    let hsv = util.RGBtoHSV([r, g, b])
    hsv[1] *= (intensity - 1)*-1;
    return util.HSVtoRGB(hsv);
};


// Blur Filter
const blurFilter = {...ImageFilterInterface};
blurFilter.maxIntensity = 20;
blurFilter.minIntensity = 0;
blurFilter.filter = function (imagenData, x, y, blurRadius = 10) {
    let startX = (centerX - blurRadius <= 0) ? 0 : centerX - blurRadius;
    let startY = (centerY - blurRadius <= 0) ? 0 : centerY - blurRadius;
    let endX   = (centerX + blurRadius >= imagenData.width -1) ? imagenData.width  : centerX + blurRadius;
    let endY   = (centerY + blurRadius >= imagenData.height-1) ? imagenData.height : centerY + blurRadius;
    let totalPixelsAffected =(blurRadius * 2 + 1)*(blurRadius * 2 + 1)
    let r = 0;
    let g = 0;
    let b = 0;
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            let index = (x + y * imagenData.width) * 4;
            r += imagenData.data[index + 0] / totalPixelsAffected;
            g += imagenData.data[index + 1] / totalPixelsAffected;
            b += imagenData.data[index + 2] / totalPixelsAffected;
        }
    }
    return [r, g, b];
};

// Saturation Filter
const saturationFilter = {...ImageFilterInterface};
saturationFilter.maxIntensity = 2;
saturationFilter.minIntensity = 1;
saturationFilter.filter = function (imagenData, x, y, intensity = 2) {
    let index = (x + y * imagenData.width) * 4;
    let r = imagenData.data[index + 0];
    let g = imagenData.data[index + 1];
    let b = imagenData.data[index + 2];
    let hsv = util.RGBtoHSV([r, g, b])
    hsv[1] *= intensity;
    return util.HSVtoRGB(hsv);
};

const sobelFilter = {...ImageFilterInterface};
sobelFilter.filter = function(imagenData, centerX, centerY) {

    let startX = (centerX - 1 <= 0) ? 0 : centerX - 1;
    let startY = (centerY - 1 <= 0) ? 0 : centerY - 1;
    let endX   = (centerX + 1 >= imagenData.width -1) ? imagenData.width  - 1 : centerX + 1;
    let endY   = (centerY + 1 >= imagenData.height-1) ? imagenData.height - 1 : centerY + 1;
    
    let xred = 0;
    let xblu = 0;
    let xgre = 0;
    let yred = 0;
    let yblu = 0;
    let ygre = 0;

    let matrixX = [-1, 0, 1,-2, 0, 2, -1, 0, 1];
    let matrixY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            let index = (x + y * imagenData.width) * 4;
            let valueX = matrixX.shift();
            let valueY = matrixY.shift();
            xred += imagenData.data[index + 0] * valueX;
            xgre += imagenData.data[index + 1] * valueX;
            xblu += imagenData.data[index + 2] * valueX;
            yred += imagenData.data[index + 0] * valueY;
            ygre += imagenData.data[index + 1] * valueY;
            yblu += imagenData.data[index + 2] * valueY;
        
        }
    }
    let r = Math.sqrt(xred*xred + yred*yred);
    let g = Math.sqrt(xgre*xgre + ygre*ygre);
    let b = Math.sqrt(xblu*xblu + yblu*yblu);
    r = (r < 70) ? 0 : 255;
    g = (g < 70) ? 0 : 255;
    b = (b < 70) ? 0 : 255;
    return [r, g, b];
};

const filters = {
    saturationFilter, 
    blurFilter, 
    grayScaleFilter, 
    sobelFilter, 
    invertImageFilter,
    invertColorImageFilter,
};

// https://es.wikipedia.org/wiki/Modelo_de_color_HSV#Transformaci%C3%B3n_RGB_a_HSV
const util = {
    RGBtoHSV: function(colour) {
        let [r, g, b] = colour;
        let h, s, v;

        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let delta = max - min;

        
        if( max ===  min  ) {
            h = 0;
        } else if(r === max) {
            if(g >= b ) {
                h = (60 * ((g - b) / delta) + 0) % 360;   
            } else {
                h = (60 * ((g - b) / delta) + 360) % 360; 
            }
        } else if(g === max) {
            h = (60 * ((b - r) / delta) +  120) % 360; 
        } else if(b === max){
            h = (60 * ((r - g) / delta) +  240) % 360;
        }
        h = Math.round( h );

        if(max === 0) {
            s = 0;
        } else {     
            s = Math.floor((delta / max) * 100);       
        }
        v = max * 100;
        
        return [h, s, v];
    },
    

    HSVtoRGB: function(colour) {
        let  r,g,b;
        let [h, s, v] = colour;
    
        s /= 100;
        v /= 100;

        let i = Math.floor( h / 60) % 6;
        let f = ( h / 60) % 6 - i;
        let p = v * ( 1 - s );
        let q = v * ( 1 - s * f );
        let t = v * ( 1 - s * ( 1 - f ) );

        p *= 255;
        q *= 255;
        t *= 255;
        s *= 255;
        v *= 255;

        switch( i ) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [r,g,b];
    }

}