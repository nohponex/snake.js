module.exports = function (grunt) {
// Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      min: {
        files: {
          'dist/snake.min.js': ['src/snake.js']
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
        dest: 'dist/',
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
        files: {'dist/snake.html': 'dist/snake.html'}
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
      }
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
          {expand: true, cwd: 'src/', src: ['images/*', 'sounds/*'], dest: 'dist/', filter: 'isFile'},
        ]}
    },
    htmlclean: {
      options: {
      },
      deploy: {
        expand: true,
        cwd: 'dist/',
        src: '**/*.html',
        dest: 'dist/'
      }
    },
    clean: {
      dist: ['dist/']
    },
    validation: {
      options: {
        reset: grunt.option('reset') || false,
        stoponerror: false,
      },
      files: {
        src: ['src/*.html'],
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-html-validation');

  // Default task(s)
  grunt.registerTask('default', ['jscs', 'jshint', 'validation']); // validate javascript files
  grunt.registerTask('+w', ['jscs', 'jshint', 'validation', 'watch']); // validate javascript files and watch
  grunt.registerTask('build', ['jscs', 'jshint', 'validation', 'clean',
    'uglify', 'htmlbuild', 'toggleComments', 'copy', 'htmlclean']); // Prepare distribution
};
