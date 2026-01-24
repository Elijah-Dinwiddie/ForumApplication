const {sql, poolPromise} = require('../config/configuration');

const forumModel = {
    // on insert, forumId will be auto generated
    createForum: async (forumData) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('forumName', sql.NVarChar, forumData.forumName)
            .input('forumDescription', sql.NVarChar, forumData.forumDescription)
            .input('createdBy', sql.Int, forumData.creatorID)
            .query(`insert into Forums (forum_name, forum_description, created_by, created_at)
                output inserted.*
                values (
                    @forumName,
                    @forumDescription,
                    @createdBy,
                    GETDATE()
                );
            `)
        return result.recordset[0];
    }
}

module.exports = forumModel;