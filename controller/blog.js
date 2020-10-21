const xss = require('xss')

const {exec} = require('../db/mysql')
// 博客列表
const getList = (author, keyword) => {
    // 1=1 的作用只是占位置，目的是为了便于拼接下方的逻辑。
    let sql = `select * from blogs where 1=1 `
    // 如果有作者
    if (author) {
        sql += `and author = '${author}' `
    }
    // 如果有作者
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    return exec(sql)

}
// 博客详情
const getDetail = (id) => {
    const sql = `select * from blogs where id=${id};`
    return exec(sql).then(rows => {
        // 将数组变成对象格式即返回元素第一项
        return rows[0]
    })
}
// 新建博客
const newBlog = (blogData = {}) => {
    const title =xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author
    const createTime = Date.now()
    const sql = `insert into blogs (title,content,createtime,author) values('${title}','${content}',${createTime},'${author}');`
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}
// 更新博客
const updataBlog = (id, blogData = {}) => {
    // id为更新博客的ID
    const title = blogData.title
    const content = blogData.content
    const sql = `update blogs set title='${title}',content='${content}' where id=${id};`
    return exec(sql).then(updateData => {
        return updateData.affectedRows > 0;
    })
}
// 删除博客
const delBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}'`
    // id 就是要删除博客的 ID
    return exec(sql).then(deleteData => {
        return deleteData.affectedRows > 0;
    })
}
module.exports = {
    getList, getDetail, newBlog, updataBlog, delBlog
}