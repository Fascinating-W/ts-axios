# 表示是一个shell脚本
###
 # @Author: Wanko
 # @Date: 2023-02-16 10:04:27
 # @LastEditors: Wanko
 # @LastEditTime: 2023-02-16 11:37:56
 # @Description: 
### 
#!/usr/bin/env sh
# e：表示脚本不为true则退
set -e

echo "Enter release version: "
# 从标准的输入读取值并赋值给version变量
read VERSION
# -p 在读取值之前，打印一段文字提示符
# -n 1 限定最多可以有个字符作为有效的读入 y或者n
# -r 禁止反斜线转意
read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo  # (optional) move to a new line
# $REPLY 默认的从控制台的读去值，=~ ^[Yy]$:判断是否是大小写y
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  # npm version：修改package.json的version字段
  # --message:备注
  npm version $VERSION --message "[release] $VERSION"
  # 提交到主干分支
  git push origin master

  # publish
  npm publish
# if 和fi是成对出现的，表示if的块
fi

