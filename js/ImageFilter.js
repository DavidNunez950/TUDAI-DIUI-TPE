export { ImageFilters };

"use strict";

// La razón por la cual se creó el objeto "ImageFilter", es para que este sea la cara visible del 
// módulo. Así, desde afuera no se conoce como está implementado, y el uso de los filtros que 
// provee este módulo no depende de como esté implementado, sino de la interfaz que provee este objeto
const ImageFilters = {
    grayScale  : function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.grayScaleFilter, intensity);
    },
    saturation : function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.saturationFilter, intensity);
    },
    blur       : function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.blurFilter, intensity);
    },
    invertImage: function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.invertImageFilter, intensity);
    },
    invertColor: function(inputImage, outputImage, intensity) {
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.invertColorImageFilter, intensity);
    },
    sobel      : function(inputImage, outputImage, intensity) {
        imageFilterApplicator.aplyFilter(inputImage, inputImage, filters.grayScaleFilter, 100);
        return imageFilterApplicator.aplyFilter(inputImage, outputImage, filters.sobelFilter, intensity);
    }
}

// Este objeto tiene la función de aplicar los filtros
const imageFilterApplicator = {

    aplyFilter: function(inputImage, outputImage, imageFilter, intensity = 0) {

        intensity = (intensity > 100) ? 100 : intensity;
        intensity = (intensity <   0) ?   0 : intensity;
        intensity = this.calulateIntensity(imageFilter, intensity);

        let r, g, b; 
        for (let y = 0; y < inputImage.height; y++) {
            for (let x = 0; x < inputImage.width; x++) {
                [r, g, b] = imageFilter.filter(inputImage, x, y, intensity);
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
    },

    calulateIntensity(filter, intensity) {
        intensity = ((intensity/100) * filter.maxIntensity ?? 0) + filter.minIntensity ?? 0; 
        return intensity;
    }
}

// El objeto "filters" tiene la función de guardar los filtros
const filters = {
    // Consigna 3: filtros simples
    // 3. Aplicar al menos cuatro filtros a la imagen actual, por ejemplo: negativo, brillo, binarización y sepia.
    // 3.1 ? Invert Image Filter
    invertImageFilter: {
        filter: function(imagenData, x, y) {
            x = imagenData.width  - 1 - x;
            y = imagenData.height - 1 - y;
            let index = (x + y * imagenData.width) * 4;
            let r = imagenData.data[index + 0];
            let g = imagenData.data[index + 1];
            let b = imagenData.data[index + 2];
            return [r, g, b];
        }
    },

    // 3.2 Inver Color Filter
    invertColorImageFilter: {
        maxIntensity: 100,
        minIntensity: 0,
        filter: function(imagenData, x, y, intensity) {
            let index = (x + y * imagenData.width) * 4;
            // El color negativo es igual la diferencia entre 255 y 
            // el valor de alguna de las variables RGB:
            // let color = imagenData.data[index + RGB];
            // let negativo = 255 - color;
            // Para poder aplicar la intensidad se necesita calcular la diferencia entre
            // el color y su negativo:
            // let diff = color - negativo; 
            // La linea de arriba es equivalente a 255 - color - color
            // Sin embargo, en el código se encuentra escrito: (255 - imagenData.data[index + RGB]*2)
            // Ahora que se calculó la diferencia solo hay que dividirlo por 100, y multiplicarlo por la
            // intensidad
            let r = imagenData.data[index + 0] + ((255 - imagenData.data[index + 0]*2)/100) * intensity ;
            let g = imagenData.data[index + 1] + ((255 - imagenData.data[index + 1]*2)/100) * intensity ;
            let b = imagenData.data[index + 2] + ((255 - imagenData.data[index + 2]*2)/100) * intensity ;
            return [r, g, b];
        }
    },
    
    // 3.3 Gray Sacle Filter
    grayScaleFilter: {
        maxIntensity: 1,
        minIntensity: 0,
        filter: function(imagenData, x, y, intensity = 0) {
            let index = (x + y * imagenData.width) * 4;
            let r = imagenData.data[index + 0];
            let g = imagenData.data[index + 1];
            let b = imagenData.data[index + 2];
            let hsv = util.RGBtoHSV([r, g, b])
            // Se decidió utilizar una implementación de filtro de grises con HSV dado que con este
            // se puede aplicar el filtro con intensidad.
            // La razón de la línea de código de abajo es la siguiente:
            // 1. Si se quiere aplicar el filtro de grises con una intensidad de 0, que la imagen se vea igual
            // hay que multiplicar la variable "s" por 1.
            // 2. Si se quiere aplicar el filtro de grises con una intensidad de 100, que la imagen se vea total mente grisácea
            // hay que multiplicar la variable "s" por 0.
            // Por tanto, la forma más fácil de lograr este efecto es calcular la diferencia entre
            // el máximo de la intensidad, y la intensidad misma.
            // Si recuperamos los ejemplos de arriba obtenemos:
            //    ((máximo de intensidad) - (intensidad)) = valor
            // 1. (           100         -     100     ) = 0
            // 2. (           100         -      0      ) = 100
            hsv[1] *= ( this.maxIntensity - intensity );
            return util.HSVtoRGB(hsv);
        }
    },

    // Consigna 4:
    // 4. Aplicar al menos dos de los siguientes filtros a la imagen: Blur, Saturación, Detección de Bordes.
    // 4.1 Blur Filter
    blurFilter: {
        maxIntensity: 10,
        minIntensity: 0,
        filter: function (imagenData, centerX, centerY, blurRadius = 10) {
            // La variable intensidad se renombró como radio de blur. Esta se utiliza para tomar
            // n pixeles hacia arriba y abajo en el eje vertical, y n pixeles hacia la derecha y la izquierda
            // en el eje horizontal, donde n es el valor del radio de blur.
            blurRadius = Math.floor(blurRadius);
            let startX = (centerX - blurRadius <= 0) ? 0 : centerX - blurRadius;
            let startY = (centerY - blurRadius <= 0) ? 0 : centerY - blurRadius;
            let endX   = (centerX + blurRadius >= imagenData.width -1) ? imagenData.width  : centerX + blurRadius;
            let endY   = (centerY + blurRadius >= imagenData.height-1) ? imagenData.height : centerY + blurRadius;
            // Los pixeles afectados para poder calcular el promedio de los colores es igual a un área
            // con forma de cuadrado. Por tanto, para calcular el área del cuadrado es igual a uno de sus lados
            // elevado al cuadrado. Los lados del cuadrado se pueden calcular como el radio del blur por dos, 
            // los n pixeles que se toman hacia la derecha y la izquierda en el eje horizontal, más
            // el mismo pixel sobre el que se está calculando el blur.
            let totalPixelsAffected = (blurRadius * 2 + 1)*(blurRadius * 2 + 1)
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
        }
    },

    // 4.2 Saturation Filter
    saturationFilter: {
        maxIntensity: 2,
        minIntensity: 0,
        filter: function(imagenData, x, y, intensity) {
            let index = (x + y * imagenData.width) * 4;
            let r = imagenData.data[index + 0];
            let g = imagenData.data[index + 1];
            let b = imagenData.data[index + 2];
            let hsv = util.RGBtoHSV([r, g, b])
            hsv[1] *= intensity;
            return util.HSVtoRGB(hsv);
        }
    },

    // 4.3 Sobel Filter
    sobelFilter: {
        maxIntensity: 1000,
        minIntensity: 0,
        filter: function (imagenData, xi, yi, intensity) { 
            // las variables x e y se renombrearon como x sub i e y sub i
            let xr = 0; // red   en eje x
            let xg = 0; // blue  en eje x
            let xb = 0; // green en eje x
            let yr = 0; // red   en eje y
            let yg = 0; // blue  en eje y
            let yb = 0; // green en eje y
        
            let matrixX = [-1,  0,  1,-2, 0, 2, -1,0, 1];
            let matrixY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
            let matrixIndex = -1;
            for (let y = - 1; y < 2; y++) {
                for (let x = -1; x < 2; x++) {
                    let index = ((xi + x) + (yi + y) * imagenData.width) * 4;
                    matrixIndex++;
                    if( xi + x >= 0 && xi + x <= imagenData.width  - 1 &&
                        yi + y >= 0 && yi + y <= imagenData.height - 1) {
                        // if( index >= 0 && index <= imagenData.length - 1) {
                        let valueX = matrixX[matrixIndex];
                        let valueY = matrixY[matrixIndex];
                        xr += imagenData.data[index + 0] * valueX;
                        xg += imagenData.data[index + 1] * valueX;
                        xb += imagenData.data[index + 2] * valueX;
                        yr += imagenData.data[index + 0] * valueY;
                        yg += imagenData.data[index + 1] * valueY;
                        yb += imagenData.data[index + 2] * valueY;
                    }
                }
            }
            let r = Math.sqrt(xr*xr + yr*yr);
            let g = Math.sqrt(xg*xg + yg*yg);
            let b = Math.sqrt(xb*xb + yb*yb);
            r = (r <= intensity) ? 0 : 255;
            g = (g <= intensity) ? 0 : 255;
            b = (b <= intensity) ? 0 : 255;
            return [r, g, b];
        }
    }
};

const util = {
    // El código de las dos funciones siguientes se implemento de acuerdo los 
    // pasos de conversion de RGB a HSV, y de HSV a RGB, descritos en wikipedia:
    // https://es.wikipedia.org/wiki/Modelo_de_color_HSV#Transformaci%C3%B3n_RGB_a_HSV
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

        let hi = Math.floor( h / 60) % 6;
        let f = ( h / 60) % 6 - hi;
        let p = v * ( 1 - s );
        let q = v * ( 1 - s * f );
        let t = v * ( 1 - s * ( 1 - f ) );

        p *= 255;
        q *= 255;
        t *= 255;
        s *= 255;
        v *= 255;

        switch( hi ) {
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