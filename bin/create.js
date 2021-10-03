const path = require('path')
// fs-extra 是对 fs 模块的扩展，支持 promise 语法
const fs = require('fs-extra')

const inquirer = require('inquirer')

const Generator = require('./Cenerator')

module.exports = async function(name, options) {

  // 当前命令行选择的目录
  const cwd = process.cwd()
  // 需要创建的目录地址
  const targetAir = path.join(cwd, name)

  // 目标是否存在
  if(fs.existsSync(targetAir)) {
    // 是否强制创建
    if(options.force) {
      await fs.remove(targetAir)
    }else {
      // TODO: 询问用户是否确定要覆盖

      // 询问用户是否确定要覆盖
      let {action} = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '目标目录已存在。请选择一个操作：',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },
            {
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])
      if(!action) return
      if(action === 'overwrite') {
        console.log('\r\nRemoving...')
        await fs.remove(targetAir)
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetAir)
  generator.create()
}