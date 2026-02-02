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
                select account_id, password_hash from AccountCredentials
                where email = @email
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
    }
}

module.exports = accountModel;