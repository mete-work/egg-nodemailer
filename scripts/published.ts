import { execSync as shell } from 'child_process';

import pkg from '../package.json';

shell(`git tag ${pkg.version}`);
shell(`git push`);
shell(`git push origin ${pkg.version}`);
