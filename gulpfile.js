const { src, dest, watch, series, parallel } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');

// Función que nos permite compilar el archivo SASS.
function css(done) {
  // Compilamos SASS

  // 1. Identificamos el archivo (hoja de SASS).
  // 2. Compilamos el archivo.
  // 3. Guardamos el archivo ".css".

  // Le indicamos el archivo para que pueda identificarlo:
    src('src/scss/app.scss')
    // Prevenir que los errores detengan la compilación
      .pipe(plumber({
        errorHandler: function(err) {
          console.error('Error en la compilación de SASS:', err.message);
          this.emit('end');
        }
      }))

        // Inicializamos la creación del sourcemap para nuestra hooja de Sass
        .pipe( sourcemaps.init() )

        // Compilamos el archivo.
        .pipe(sass())
        .pipe(postcss([
          // Función en concreto para comprimir el archivo .css:
          autoprefixer(), cssnano()
          
          // autoprefixer()
        ]))

        // El sourcemap se guardará en el mismo lugar que la hoja de Sass gracias al "."
        .pipe( sourcemaps.write('.'))

        // Y por último, lo almacenamos en el proyecto.
        .pipe(dest("build/css"));

    done();
}

// Tarea para copiar y minificar Eins Modals
function copyEinsModals(done) {
  src('node_modules/eins-modal/dist/js/eins-modal.min.js')
    .pipe(uglify())
    .pipe(dest('build/js'));
  done();

  return src('node_modules/eins-modal/dist/css/eins-modal.min.css')
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(dest('build/css'));
}

// Función que nos permite compilar en tiempo real el archivo SASS.
function dev() {
  // La función watch() toma como argumentos dos argumentos:
  // El primero se trata del archivo a inspeccionar y,
  // en caso de cambios en el mismo,
  // ejecuta la función que toma como segundo argumento.

  // Sintaxis para múltiples archivos con la extensión ".scss":
    watch('src/scss/**/*.scss', css);
}

exports.css = css;
exports.copyEinsModals = copyEinsModals;
exports.dev = dev;

// Con series podemos inicializar múltiples tareas, pero primero debe
// llegar a su final la primera para poder continuar con la segunda tarea.

// Con Parallel podemos realizar múltiples tareas en paralelo, lo que quiere decir
// que todas las tareas se ejecutarán al mismo tiempo e irán finalizando en su respectivo orden.

// Tareas por default:
exports.default = series(css, copyEinsModals, dev);