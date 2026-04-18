const {sql, poolPromise} = require('../config/configuration');

const accountModel = {
    // Create public account info
    createPublicAccountDetailsModel: async (accountName) => {
        const pool = await poolPromise
        const result = await pool.request()
            .input('accountName', sql.NVarChar, accountName)
            .query(`
                insert into Accounts (account_name, created_at)
                output inserted.*
                values (
                    @accountName,
                    GETDATE()
                );
            `)
        return result.recordset[0];
    },

    // Add info to private accounts table
    createAccountCredentialsModel: async (accountData, accountID) => {
        const pool = await poolPromise
        const result = await pool.request()
            .input('email', sql.NVarChar, accountData.email)
            .input('hashedPassword', sql.NVarChar, accountData.password)
            .input('accountID', sql.Int, accountID)
            .query(`
                insert into AccountCredentials (account_id, email, password_hash, isAdmin)
                output inserted.*
                values (
                    @accountID,
                    @email,
                    @hashedPassword,
                    0
                );
            `)
        return result.recordset[0];
    },

    // Authenticate account login
    loginAccountModel: async (loginData) => {
        const pool = await poolPromise
        const result = await pool.request()
            .input('email', sql.NVarChar, loginData.email)
            .query(`
                select ac.account_id, ac.password_hash, a.is_deleted,  ac.isAdmin
                from AccountCredentials as ac 
                left join Accounts as a on ac.account_id = a.account_id
                where email = @email;
            `)
        return result.recordset[0];
    },

    //Update account name
    updateAccountNameModel: async (accountID, updateData) => {
        const pool = await poolPromise
        const result = await pool.request()
            .input('accountID', sql.Int, accountID)
            .input('updatedName', sql.NVarChar, updateData.accountName)
            .query(`
                update Accounts
                set
                    account_name = @updatedName
                output inserted.*
                where account_id = @accountID;
            `)
        return result.recordset[0].account_name;
    },

    //Update account email
    updateAccountEmailModel: async (accountID, updateData) => {
        const pool = await poolPromise
        const result = await pool.request()
            .input('accountID', sql.Int, accountID)
            .input('updatedEmail', sql.NVarChar, updateData.email)
            .query(`
                update AccountCredentials
                set
                    email = @updatedEmail
                output inserted.*
                where account_id = @accountID;
            `)
        return result.recordset[0].email;
    },

    //Delete account
    deleteAccountModel: async (accountID) => {
        const pool = await poolPromise
        const result = await pool.request()
            .input('accountID', sql.Int, accountID)
            .query(`
                update Accounts
                set
                    is_deleted = 1
                output inserted.*
                where account_id = @accountID;
            `)
        return result.recordset[0];
    },

    //Get account
    getAccountModel: async (accountID) => {
        const pool = await poolPromise
        const result = await pool.request()
            .input('accountID', sql.Int, accountID)
            .query(`
                select a.account_name, a.account_id, a.created_at, a.is_deleted, ac.email, ac.isAdmin
                from Accounts a
                    left join accountCredentials ac on a.account_id = ac.account_id
                where a.account_id = @accountID;
            `)

        return result.recordset[0];
    },

    //Get accounts with email
    getAccountsWithEmailModel: async (email) => {
        const pool = await poolPromise
        const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query(`
            select email from accountCredentials
            where email = @email;
        `)

        return result.recordset;
    }
}

module.exports = accountModel;