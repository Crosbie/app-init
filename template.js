'use strict';

exports.description = 'Create FH app template';

exports.notes = '_Note:_ If you do _not_ want to use the studio to build ' +
    'this project, you should use the _feedhenry-decoupled_ init task instead.';

// Warn on any non-dot file, .jshintrc or .gitignore.
exports.warnOn = ['*', '.jshintrc', '.gitignore'];

exports.template = function(grunt, init, done) {
  init.process({}, [
    init.prompt('name'),
    init.prompt('title'),
    init.prompt('description'),
    init.prompt('version'),
    {
      name: 'assembla',
      message: 'Project name on Assembla',
      default: 'none',
      warning: 'If there is no corresponding project on Assembla, just hit ' +
          'enter.'
    },
    {
      name: 'less',
      message: 'Use LESS for styling',
      default: 'true',
      warning: 'Using LESS is easy, and will help you manage the style of the app more efficiently.'
    },
  ], function(err, props) {

    // If the project has an associated assembla project, we'll use that to link
    // to relevant pages etc. throughout the project; useful for everyone
    // involved in future, for reference.
    if (props.assembla && props.assembla !== 'none') {
      props.repository = 'git://git.assembla.com/' + props.assembla + '.git';
      props.homepage = 'https://feedhenry.assembla.com/spaces/' +
          props.assembla + '/';
      props.bugs = props.homepage + 'tickets';
    }

    // If user wants to use LESS styling, copy the less folder into project directory
    if(props.less && props.less === 'true'){
      init.copy('less', 'root/client/default');
    }


    // These should always be the same for PS projects.
    props.author_email = 'support@feedhenry.com';
    props.author_name = 'FeedHenry';
    props.author_url = 'http://www.feedhenry.com';

    // The only hard-dependency we know of at project beginning.
    props.dependencies = {
      'fh-nodeapp': '*'
    };

    var files = init.filesToCopy(props);
    init.copyAndProcess(files, props);

    // For studio project there's no need for another root level package.json.
    init.writePackageJSON('cloud/package.json', props);

    done();
  });
};