const {sql, poolPromise} = require('../config/configuration');

const postModel = {
    createPostModel: async (userID, threadID, post, maxPostNum) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .input('threadID', sql.Int, threadID)
            .input('post', sql.NVarChar, post)
            .input('max', sql.Int, maxPostNum)
            .query(`
                insert into Posts (thread_id, account_id, created_at, post_text, is_deleted, post_number)
                output inserted.*
                values (@threadID, @userID, GETDATE(), @post, 0, @max+1);
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
                order by post_number
                offset @offset rows
                fetch next 10 rows only
            `)
        return result.recordset;
    },

    getPostModel: async (threadID, postID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('threadID', sql.Int, threadID)
            .input('postID', sql.Int, postID)
            .query(`
                select * from posts
                where thread_id = @threadID
                and post_id = @postID
            `)

        return result.recordset[0];
    },

    updateTextModel: async (updateText, threadID, postID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('updateText', sql.NVarChar, updateText)
            .input('threadID', sql.Int, threadID)
            .input('postID', sql.Int, postID)
            .query(`
                update posts
                set post_text = @updateText
                output inserted.*
                where thread_id = @threadID
                and post_id = @postID
            `)
        return result.recordset;
    },

    deletePostModel: async (toDelete, threadID, postID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('toDelete', sql.Bit, toDelete)
            .input('threadID', sql.Int, threadID)
            .input('postID', sql.Int, postID)
            .query(`
                update posts
                set is_deleted = @toDelete
                output inserted.*
                where thread_id = @threadID
                and post_id = @postID
            `)
        return result.recordset;
    },

    getMaxPostNumModel: async (thread_id) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('threadID', sql.Int, thread_id)
            .query(`
                select isnull(max(post_number), 0) as max
                from Posts
                where thread_id = @threadID;
            `)

            return result.recordset[0];
    }
}

module.exports = postModel;