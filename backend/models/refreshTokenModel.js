const {sql, poolPromise} = require('../config/configuration');

const refreshTokenModel = {
    // insert new refresh token into database
    createRefreshTokenModel: async (tokenData) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('accountID', sql.Int, tokenData.account_id)
            .input('tokenHash', sql.NVarChar, tokenData.token_hash)
            .input('jti', sql.NVarChar, tokenData.jti)
            .input('expiresAt', sql.DateTime, tokenData.expires_at)
            .query(`
                insert into RefreshTokens (account_id, token_hash, jti, expires_at, created_at)
                output inserted.*
                values (
                    @accountID,
                    @tokenHash,
                    @jti,
                    @expiresAt,
                    GETDATE()
                );
            `);
        return result.recordset[0];
    },

    // get refresh token by jti
    getRefreshTokenByJtiModel: async (jti) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('jti', sql.NVarChar, jti)
            .query(`
                select * from RefreshTokens
                where jti = @jti;
            `);
        return result.recordset[0];
    },

    // update refresh token's expires_at and replaced_by
    updateRefreshTokenModel: async (jti, updateData) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('jti', sql.NVarChar, jti)
            .input('replacedBy', sql.NVarChar, updateData)
            .query(`
                update RefreshTokens
                set
                    replaced_by = @replacedBy,
                    revoked_at = GETDATE()
                output inserted.*
                where jti = @jti;
            `)
        return result.recordset[0];
    },

    // revoke all tokens by account ID (used when a token is found to be compromised)
    revokeAllTokensByAccountIdModel: async (accountId) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('accountId', sql.Int, accountId)
            .query(`
                update RefreshTokens
                set
                    revoked_at = GETDATE()
                where account_id = @accountId AND revoked_at IS NULL;                
            `)
        return result.rowsAffected;
    }

}

module.exports = refreshTokenModel;