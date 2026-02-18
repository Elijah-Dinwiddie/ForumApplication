const {sql, poolPromise} = require('../config/configuration');

const postModel = {
    createPostModel: async (userID, threadID, post) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .input('threadID', sql.Int, threadID)
            .input('post', sql.NVarChar, post)
            .query(`
                insert into Posts (thread_id, account_id, created_at, post_text, is_deleted)
                output inserted.*
                values (@threadID, @userID, GETDATE(), @post, 0);
            `)
        return result.recordset[0];
    },

    getPagPostsModel: async (offset, threadID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('threadID', sql.Int, threadID)
            .input('offset', sql.Int, offset)
            .query(`
                select * from posts
                where thread_id = @threadID
                order by post_id
                offset @offset rows
                fetch next 10 rows only
            `)
        return result.recordsets[0];
    }
}

module.exports = postModel;