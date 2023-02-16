/*
 * @Author: Wanko
 * @Date: 2022-12-16 14:35:35
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-16 14:35:52
 * @Description:
 */
const cookie = {
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
