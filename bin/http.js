const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data;
})

/**
 * 获取模板
 * @returns 
 */
async function getRepoList() {
  return axios.get('https://api.github.com/users/mingju0421/repos')
  // return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}

async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList
}