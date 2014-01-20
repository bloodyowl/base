var routes = require("./routes")
  , routeObject = {}
  , LAYOUT_PATH = "./layout/"
  , path = require("path")
  , autoPrefixer = require("autoprefixer-stylus")
  , i18n = require("./i18n")
  
Object.keys(routes)
  .forEach(function(key){
    routeObject[path.resolve(__dirname, "./dist/", key)] = path.resolve(LAYOUT_PATH, routes[key] + ".jade")
  })

module.exports = function(grunt){

  grunt.loadNpmTasks("grunt-contrib-copy")
  grunt.loadNpmTasks("grunt-contrib-jade")
  grunt.loadNpmTasks("grunt-contrib-stylus")
  grunt.loadNpmTasks("grunt-contrib-connect")
  grunt.loadNpmTasks("grunt-contrib-watch")
  grunt.loadNpmTasks("grunt-webfont")
  grunt.loadNpmTasks("grunt-browserify")
  
  grunt.initConfig({
    copy : {
      main : {
        expand: true,
        cwd: path.join(__dirname, "public/"),
        src: "**",
        dest: path.join(__dirname, "dist/")
      },
      images : {
        expand: true,
        cwd: path.join(__dirname, "images/"),
        src: "**",
        dest: path.join(__dirname, "dist/images/")
      }
    },
    jade : {
      main : {
        options : {
          data : {
            routes: routes,
            i18n: i18n
          }
        },
        files: routeObject
      }
    },
    stylus : {
      compile: {
        options : {
          use : [
            autoPrefixer
          ],
          "include css" : true
        },
        files: {
          "./dist/styles/index.css": "./styles/index.styl"
        }
      }
    },
    connect: {
      server: {
        options: {
          hostname : "localhost",
          port: 8080,
          base: "dist"
        }
      }
    },
    webfont: {
      icons: {
        src: path.resolve(__dirname, "./images/**/*.svg"),
        dest: path.resolve(__dirname, "./dist/fonts/icons"),
        destCss: path.resolve(__dirname, "./css/imports/"),
        syntax: "bem",
        options: {
          stylesheet: "css",
          htmlDemo: true,
          destHtml: path.resolve(__dirname, "./dist/"),
          relativeFontPath: "../fonts/icons/",
          templateOptions: {
            baseClass: "Icon",
            classPrefix: 'Icon--',
            mixinPrefix: 'Icon-'
          },
          ie7: true
        }
      }
    },
    browserify: {
      dist: {
        files: {
          "dist/scripts/index.js": ["scripts/index.js"],
        }
      }
    },
    watch : {
      scripts: {
        files: ["scripts/*.js"],
        tasks: ["browserify"]
      },
      styles: {
        files: ["styles/*.styl", "styles/**/*.styl", "styles/**/*.css"],
        tasks: ["stylus"]
      },
      markup: {
        files: ["layout/*.jade", "layout/**/*.jade"],
        tasks: ["jade"]
      },
      fonts: {
        files: ["font/*.svg", "font/**/*.*svg"],
        tasks: ["webfont", "stylus"]
      },
      images: {
        files: ["images/*.*", "images/**/*.*"],
        tasks: ["copy:images"]
      }
    }
  })
  
  grunt.registerTask("default", ["copy", "jade", "stylus", "browserify"])
  // make webfont optional so that diff isn't fucked up
  grunt.registerTask("build", ["copy", "webfont", "jade", "stylus"])
  grunt.registerTask("server", ["connect", "watch"])
  
}
