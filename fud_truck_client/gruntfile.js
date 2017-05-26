module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        imagemin: {
            jpg: {
                options: {
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'img/',
                        src: ['**/*.jpg'],
                        dest: 'truck-finder/img/'
                    }
                ]
            },
            png: {
                options: {
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'img/',
                        src: ['**/*.png'],
                        dest: 'truck-finder/img/'
                    }
                ]
            },
            gif: {
                options: {
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'img/',
                        src: ['**/*.gif'],
                        dest: 'truck-finder/img/'
                    }
                ]
            }


        },

        concat: {
            dist: {
                src: [
                    'app/**/*.js', // All JS in the libs folder
//                    'app/*.js'  // This specific file
                ],
                dest: 'truck-finder/js/production.js'
            }
        },
//        uglify: {
//            options: {
//                manage: false,
//            },
//            my_target: {
//                files: [{
//                        expand: true,
//                        cwd: 'truck-finder/js',
//                        src: ['production.js'],
//                        dest: 'truck-finder/js/production.min.js'
//                    }]
//            }
//        },

        uglify: {
            build: {
                src: 'truck-finder/js/production.js',
                dest: 'truck-finder/js/production.min.js'
            }
        },
        less: {
            options: {
                plugins: [new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})]
            },
            main: {
                files: {
                    'truck-finder/css/main.min.css': 'css/main.less'
                }
            }
        },
        concat_css: {
//            options: {},
//            files: {
//                'truck-finder/css/production.css': ['css/bootstrap.min.css','css/main.css', 'truck-finder/css/main.min.css','css/bootstrap-select.css','css/animate.css'],
//            },
            options: {
                // Task-specific options go here. 
            },
            all: {
                src: ['css/bootstrap.min.css', 'css/main.css', 'truck-finder/css/main.min.css', 'css/bootstrap-select.css', 'css/animate.css'],
                dest: "truck-finder/css/production.css"
            }
        },
        cssmin: {
            my_target: {
                files: [
                    {
                        expand: true,
                        cwd: 'truck-finder/css/',
                        src: ['production.css'],
                        dest: 'truck-finder/css',
                        ext: '.min.css'
                    }
                ]
            }
        },
//        cssmin: {
//            my_target: {
//                files: [{
//                        expand: true,
//                        cwd: 'css/',
//                        src: ['*.css', '!*.min.css'],
//                        dest: 'truck-finder/css',
//                        ext: '.css'
//                    }]
//            }
//        },
//        less: {
//            options: {
//                plugins: [new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})]
//            },
//            main: {
//                files: {
//                    'truck-finder/css/main.min.css': 'css/main.less'
//                }
//            }
//        },
        htmlmin: {// Task
            dist: {// Target
                options: {// Target options
                    removeComments: false,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/',
                        src: ['**/*.html', '**/!*.min.html'],
                        dest: 'truck-finder/templates',
                        ext: '.html'
                    }
                ]
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
//                    {expand: true, src: ['script/*'], dest: 'truck-finder/script/', filter: 'isFile'},
                    // makes all src relative to cwd
//                    {expand: true, cwd: 'script/', src: ['**'], dest: 'truck-finderscript/'},
                    // flattens results to a single level
//                    {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},

                    // includes files within path and its sub-directories
                    {expand: true, src: ['script/**'], dest: 'truck-finder/'},
                    // includes files within path and its sub-directories
                    {expand: true, src: ['sounds/**'], dest: 'truck-finder/'},
                    // includes files within path and its sub-directories
                    {expand: true, src: ['fonts/**'], dest: 'truck-finder/'},
                ]
            }
        },
        watch: {
            options: {
            },
            scripts: {
                files: ['app/**/*.js', 'app/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
//                    spawn: false,
                    livereload: true
                }
            },
            css: {
                files: ['css/*.less', 'css/*.css'],
                tasks: ['less', 'concat_css', 'cssmin'],
                options: {
//                    spawn: false,
                    livereload: true
                }
            },
            html: {
                files: ['app/**/*.html'],
                tasks: ['htmlmin'],
                options: {
//                    spawn: false,
                    livereload: true
                }
            },
            script: {
                files: ['script/*'],
                tasks: ['copy'],
                options: {
//                    spawn: false,
                    livereload: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('less-plugin-autoprefix');
    grunt.loadNpmTasks('less-plugin-clean-css');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
//    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['concat', 'uglify', 'less', 'concat_css', 'cssmin', 'htmlmin', 'imagemin','copy']);
};
