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
    },

    getPagThreadsModel: async (offset, forumID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('offset', sql.Int, offset)
            .input('forumID', sql.Int, forumID)
            .query(`
                select * from Threads
                where forum_id = @forumID
                order by thread_id
                offset @offset rows
                fetch next 10 rows only
            `)

        return result.recordsets;
    },

    getThreadById: async (forumID, threadID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('forumID', sql.Int, forumID)
            .input('threadID', sql.Int, threadID)
            .query(`
                select * from Threads
                where forum_id = @forumID
                and thread_id = @threadID
                order by thread_id;
            `)
        return result.recordset[0];
    }
}

module.exports = threadModel;