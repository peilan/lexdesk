'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const lint = require('./gulp-tasks/lint.js');
const sequelizeTestSetup = require('gulp-sequelize-test-setup');

gulp.task('default', () => {
  console.log('default task');
})
.task('lint', lint)
.task('setup-dev', () => {
  process.env.NODE_ENV = 'development';
  const models = require('./src/db/models');

  return models.sequelize.sync({
    force: true
  }).then(() => {
    console.log('sync complete');
    process.exit();
  });
}).task('setup-test', () => {
  process.env.NODE_ENV = 'test';
  const models = require('./src/db/models');
  return gulp.src('./test/fixtures/**/*', {
      read: false
    })
    .pipe(sequelizeTestSetup({
      sequelize: models.sequelize,
      models: models,
      migrationsPath: './src/db/migrations',
      truncate: false
    }));
}).task('test', ['setup-test'], () => {
  return gulp.src('./test/**/*.js', {
    read: false
  })
  .pipe(mocha())
  .once('error', () => {
    process.exit(1);
  })
  .once('end', () => {
    process.exit();
  });
});
