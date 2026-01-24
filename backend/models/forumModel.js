const {sql, poolPromise} = require('../config/configuration');

const forumModel = {
    // on insert, forumId will be auto generated
    createForum: async (forumData) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('forumName', sql.string, forumData.forumName)
            .input('forumDescription', sql.string, forumData.forumDescription)
            .input('createdBy', sql.string, forumData.createdBy)
            .query(`insert into Forums (forumName, forumDescription, createdBy, createdAt)
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