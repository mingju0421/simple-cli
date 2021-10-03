// 处理项目创建逻辑

const {getRepoList, getTagList} = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')

const downloadGitRepo = require('download-git-repo')  // 不支持 promise
const util = require('util')
const path = require('path')

const chalk = require('chalk')


// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化,传入提示信息
  const spinner = ora(message)
  // 开始加载动画
  spinner.start()

  try {
    // 执行传入的方法
    const result = await fn(...args)
    // 状态修改为成功
    spinner.succeed()
    return result
  } catch (error) {
    // 状态修改为失败
    spinner.fail('运行失败, 刷新...')
  }
}


class Generator{
  constructor(name, targetDir) {
    this.name = name
    this.targetDir = targetDir

    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }
  
  // 获取用户选择的模板
  // 从远程拉取模板名称
  // 用户选择自己新下载的模板名称
  // 返回 用户选择的名称
  async getRepo() {
    // 从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, '获取模板中')
    if(!repoList) return

    // 过滤我们需要的模板名称
    const repos = repoList.map(item => item.name)

    // 用户选择自己下载的模板名称
    const  {repo} = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '请选择模板创建项目'
    })

    // 返回用户选择的名称
    return repo
  }

  // 获取用户选择的版本
  // 基于 repo 结果, 远程拉取对应的 tag 列表
  // 用户选择自己需要下载的 tag
  // 返回用户选择的 tag
  async getTag(repo) {
    // 基于 repo 结果, 远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, '获取版本中', repo)
    if(!tags) return

    // 过滤需要的 tag 名称
    const  tagsList = tags.map(item => item.name)

    // 用户选择自己需要下载的 tag 名称
    const {tag} = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: '请选择版本创建项目'
    })

    return tag
  }

  // 下载远程模板
  // 拼接下载地址
  // 调用下载方法
  async download(repo, tag) {
    // 拼接下载地址
    // const requestUrl = `zhurong-cli/${repo}${tag ? '#' + tag : ''}`
    const requestUrl = `mingju0421/${repo}${tag ? '#' + tag : ''}`
    console.log(chalk.red(this.targetDir))
    console.log(chalk.red(path.resolve(process.cwd(), this.targetDir)))

    // 调用下载方法
    await wrapLoading(
      this.downloadGitRepo,
      '下载模板中',
      requestUrl,
      path.resolve(process.cwd(), this.targetDir)
    )
  }

  // 核心创建逻辑
  // 获取模板名称
  // 获取标签名称
  // 下载模板都模板目录
  async create() {
    // 获取模板名称
    const repo = await this.getRepo()
    // const tag = await this.getTag(repo)

    // 下载模板到模板目录
    // await this.download(repo, tag)
    await this.download(repo)
    // console.log('用户选择了, reop=' + repo + ', tag=' + tag)
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev\r\n')
  }
}

module.exports = Generator