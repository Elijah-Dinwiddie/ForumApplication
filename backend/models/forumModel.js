const {sql, poolPromise} = require('../config/configuration');

const forumModel = {
    // on insert, forumId will be auto generated
    createForumModel: async (forumData, accountID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('forumName', sql.NVarChar, forumData.forumName)
            .input('forumDescription', sql.NVarChar, forumData.forumDescription)
            .input('createdBy', sql.Int, accountID)
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
    getPagForumsModel: async (offset, forumID) => {
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
        return result.recordsets[0];
    },

    // retrieve a forum by its ID
    getForumByIdModel: async (forumID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('forumID', sql.Int, forumID)
            .query(`
                select * from Forums
                where forum_id = @forumID
            `)
        
        return result.recordset[0];
    },

    // update forum by its ID
    updateForumModel: async (forumID, forumData) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('forumID', sql.Int, forumID)
            .input('forumName', sql.NVarChar, forumData.forumName)
            .input('forumDescription', sql.NVarChar, forumData.forumDescription)
            .query(`
                update Forums
                set 
                    forum_name = @forumName,
                    forum_description = @forumDescription
                output inserted.*
                where forum_id = @forumID
            `)
        return result.recordset[0];
    },

    // delete forum by its ID
    deleteForumModel: async (forumID) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('forumID', sql.Int, forumID)
            .query(`
                delete from Forums
                output deleted.*
                where forum_id = @forumID
            `)
        return result.recordset[0];
    }
};

module.exports = forumModel;