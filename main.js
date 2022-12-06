const core = require('@actions/core');
const github = require('@actions/github');

const repository = core.getInput('repository');
var owner = core.getInput('owner');
var repo = core.getInput('repo');
var excludes = core.getInput('excludes').trim().split(",");

const octokit = github.getOctokit(myToken);

async function run() {
    try {
        if (repository){
                [owner, repo] = repository.split("/");
        }
        var releases = (await octokit.rest.repos.listReleases({
            owner: owner,
            repo: repo,
            })).data;
        if (excludes.includes('prerelease')) {
            releases = releases.filter(x => x.prerelease != true);
        }
        if (excludes.includes('draft')) {
            releases = releases.data.filter(x => x.draft != true);
        }
        if (releases.length) {
            core.setOutput('release', releases[0].tag_name);
            core.setOutput('id', String(releases[0].id));
        } else {
            core.setFailed("No valid releases");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
