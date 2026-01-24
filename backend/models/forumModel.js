const {sql, poolPromise} = require('../config/configuration');

const forumModel = {
    // on insert, forumId will be auto generated
    createForumModel: async (forumData) => {
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
    },

    // retrieve forums with pagination
    getPagForumsModel: async (offset) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('offset', sql.Int, offset)
            .query(`
                begin
                    select * from Forums
                    order by forum_id
                    offset @offset rows
                    fetch next 10 rows only
                end
            `)
        return result.recordsets;
    }
}

module.exports = forumModel;