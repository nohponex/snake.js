module.exports = function (grunt) {
// Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      min: {
        files: {
          'build/snake.min.js': ['src/snake.js']
        }
      }
    },
    watch: {
      scripts: {
        files: 'src/*',
        tasks: ['jscs'],
        options: {
          interrupt: false,
        }
      }
    },
    htmlbuild: {
      dist: {
        src: 'src/snake.html',
        dest: 'build/',
        options: {
        }
      }
    },
    toggleComments: {
      customOptions: {
        options: {
          padding: 4,
          removeCommands: true
        },
        files: {'build/snake.html': 'build/snake.html'}
      }
    },
    jscs: {
      main: {
        src: ['src/*.js'],
        options: {
          config: '.jscsrc',
          fix: false,
          force: true,
          esnext: true, // If you use ES6 http://jscs.info/overview.html#esnext
          verbose: false // If you need output with rule names http://jscs.info/overview.html#verbose
        },
      },
      /*fix: {
        src: ['src/*.js'],
        options: {
          config: '.jscsrc',
          fix: true,
          force: true,
          esnext: true, // If you use ES6 http://jscs.info/overview.html#esnext
          verbose: false // If you need output with rule names http://jscs.info/overview.html#verbose
        }
      }*/
    },
    jshint: {
      allFiles: [
        'Gruntfile.js',
        'src/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, cwd: 'src/', src: ['images/*', 'sounds/*'], dest: 'build/', filter: 'isFile'},
          //{expand: true, cwd: 'path/' src: ['src/sounds/*'], dest: 'build', filter: 'isFile'},
        ]}
    },
    htmlclean: {
      options: {
      },
      deploy: {
        expand: true,
        cwd: 'build/',
        src: '**/*.html',
        dest: 'build/'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-comment-toggler');
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-htmlclean');
  // Default task(s).
  //grunt.registerTask('default', ['ngAnnotate', 'uglify',  'watch']);
  grunt.registerTask('default', ['jscs', 'jshint']); //test
  grunt.registerTask('+w', ['jscs', 'jshint', 'watch']); //test
  grunt.registerTask('build', ['jscs', 'uglify', 'htmlbuild', 'toggleComments', 'copy', 'htmlclean']);
};
