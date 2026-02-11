const {sql, poolPromise} = require('../config/configuration');

const threadModel = {
    createThreadModel: async (forumID, threadInformation, accountID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('forumID', sql.Int, forumID)
            .input('threadTitle', sql.NVarChar, threadInformation.threadTitle)
            .input('threadPost', sql.NVarChar, threadInformation.threadPost)
            .input('creatorID', sql.Int, accountID)
            .query(`
                insert into Threads (thread_name, forum_id, created_by, created_at, thread_post)
                output inserted.*
                values (
                    @threadTitle,
                    @forumID,
                    @creatorID,
                    GETDATE(),
                    @threadPost
                );
            `)

            return result.recordset[0];
    }
}

module.exports = threadModel;