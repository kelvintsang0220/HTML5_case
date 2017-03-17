module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
  		compass: {
	         dist: {
	             options: {
	                 sassDir: 'assets/sass',
	                 cssDir : 'bulid/css',
	                 outputStyle: 'compressed',
//	                 outputStyle: 'expanded',
	                 noLineComments: true,
	             }
	         },
	        sprite: {
	            options: {
	                sassDir: 'assets/sass',
	                // specify: 'assets/sass/sprite.scss',
	                cssDir : 'app/css',
	                // imagesDir: "assets/sass/images"
	                // httpPath:"app/css",
	            }
	        }
	    },
//	    concat:{
//	    		js:{
//	    			src:['bulid/js/lib/require.js','bulid/js/lib/zepto.min.js'],
//	    			dest:'bulid/js/lib/lib.js'
//	    		}
//	    },
	    uglify: {
				bulid:{
		            src: 'bulid/js/Mibus.js',
		            dest: 'bulid/js/Mibus.min.js'
		        }
			},
	    connect: {
		    options: {
		        port: 9999,
//		        hostname: '172.27.35.3', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
//		        hostname: '192.168.0.2', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
		        hostname: '192.168.253.4', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
		        livereload: 35728  //声明给 watch 监听的端口
		    },

		    server: {
		        options: {
		          open: true, //自动打开网页 http://
		          base: [
		          		''  //主目录
		          ]
		        }
		    }
	    }, 
//	    imagemin: {
//          dynamic: {
//		        options: {
//		            optimizationLevel: 3 // png图片优化水平，3是默认值，取值区间0-7
//		        },
//		        files: [
//		            {
//		                expand: true, // 开启动态扩展
//		                cwd: "bulid/images/", // 当前工作路径
//		                src: ["**/*.{png,jpg,gif}"], // 要出处理的文件格式(images下的所有png,jpg,gif)
//		                dest: "bulid/images/" // 输出目录(直接覆盖原图)
//		            }
//		        ]
//		    }
//      },
	    watch: {
	        compass: {
	            files: ['**/*.scss'],
	            tasks: ['compass']
	        },

	        livereload: {
		        options: {
		          livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
		        },
		        files: [  //下面文件的改变就会实时刷新网页
		          'bulid/*.html',
		          'bulid/*/*.html',
		          'bulid/css/*.css',
		          'bulid/js/*.js',
		          // 'app/scripts/{,*/}*.js',
		          // 'app/images/{,*/}*.{png,jpg}'
		        ]
		    },

	    },
  });
  
  	grunt.registerTask('serve', ['connect:server',  'watch'] );
};