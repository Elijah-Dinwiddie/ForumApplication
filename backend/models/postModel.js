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
    }
}

module.exports = postModel;