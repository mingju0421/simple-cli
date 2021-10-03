#! /usr/bin/env node

// 自定义命令
const program = require('commander')
// 控制台样式
const chalk = require('chalk')

program
  .command('create <app-name>')
  .description('create a new project')
  // -f or --force 为强制创建, 如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    // 在 create.js 中执行创建任务
    require('../bin/create')(name, options)
    // console.log(`name: ${name}, options:`, options)
  })

// 配置 config 命令
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, -delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, options)
  })

program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((options => {
    console.log(options)
  }))

  program
  .on('--help', () => {
    console.log(`\r\nRun ${chalk.cyan(`zr <command> --help`)} for detailed usage of given command\r\n`)
  })

program
  // 配置版本号信息
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

// 解析用户执行命令传入参数
program.parse(process.argv)