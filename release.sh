# 表示是一个shell脚本
###
 # @Author: Wanko
 # @Date: 2023-02-16 10:04:27
 # @LastEditors: Wanko
 # @LastEditTime: 2023-02-16 10:23:24
 # @Description: 
### 
#!/usr/bin/env sh
# e：表示脚本不为true则退
set -e
echo "Enter release version: "
read VERSION
read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo  # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"
  git push origin master

  # publish
  npm publish
fi

